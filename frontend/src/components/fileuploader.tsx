

"use client";

import type React from "react";
import axios from "axios";
import { useState, useRef, useCallback } from "react";
import { Upload, Paperclip, AlertCircle } from "lucide-react";
import type { File } from "@/types/index";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "./ui/toastui";
import { Button } from "./ui/Button";
import { useAuth } from "./authcontext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

interface FileUploaderProps {
  onFileUpload: (files: File[]) => void;
}

export function FileUploader({ onFileUpload }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { token } = useAuth();

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      processFiles(droppedFiles);
    }
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  }, []);

  const processFiles = async (fileList: globalThis.File[]) => {
    // Validate files are PDFs
    const pdfFiles = fileList.filter((file) => 
      file.type === "application/pdf" || file.name.toLowerCase().endsWith('.pdf')
    );

    if (pdfFiles.length === 0) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF files only",
        variant: "destructive",
      });
      return;
    }

    // Check token
    if (!token) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to upload files",
        variant: "destructive",
      });
      return;
    }

    // Check file size
    const oversizedFiles = pdfFiles.filter((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      toast({
        title: "File too large",
        description: `${oversizedFiles[0].name} exceeds the 10MB limit`,
        variant: "destructive",
      });
      return;
    }

    // Create file objects for UI
    const newFilesMap: Record<string, File> = {};
    const newFiles: File[] = pdfFiles.map((file) => {
      const id = uuidv4();
      const newFile = {
        id,
        name: file.name,
        size: file.size,
        type: file.type || "application/pdf",
        status: "uploading" as const,
        progress: 0,
        originalFile: file,
      };
      newFilesMap[id] = newFile;
      return newFile;
    });

    // Update UI with new files
    onFileUpload(newFiles);
    setIsUploading(true);
    
    // Track uploading files
    setUploadingFiles(prev => {
      const updated = { ...prev };
      newFiles.forEach(file => { updated[file.id] = true; });
      return updated;
    });

    // Upload files to backend - one at a time to avoid overwhelming server
    for (const file of newFiles) {
      try {
        if (!file.originalFile) {
          throw new Error("File is missing");
        }

        const formData = new FormData();
        formData.append("file", file.originalFile);

        // Create progress tracker
        const progressInterval = setInterval(() => {
          file.progress += Math.min(5, 100 - file.progress);
          if (file.progress >= 95) clearInterval(progressInterval);
          onFileUpload([{ ...file }]);
        }, 200);

        const response = await axios.post(`${API_URL}/api/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });

        // Clear progress interval
        clearInterval(progressInterval);

        if (response.status !== 200) {
          throw new Error(response.data?.message || "Conversion failed");
        }

        // Update file with server ID and status
        const updatedFile = {
          ...file,
          id: response.data.conversionid, // Use server-generated ID
          status: "success" as const,
          progress: 100
        };
        
        onFileUpload([updatedFile]);
        
        // Remove from uploading tracker
        setUploadingFiles(prev => {
          const updated = { ...prev };
          delete updated[file.id];
          return updated;
        });

        toast({
          title: "Conversion successful",
          description: `${file.name} has been converted to XML`,
        });
      } catch (error) {
        console.error("Upload error:", error);
        
        // Update file status to error
        const updatedFile = {
          ...file,
          status: "error" as const,
          progress: 0
        };
        
        onFileUpload([updatedFile]);
        
        // Remove from uploading tracker
        setUploadingFiles(prev => {
          const updated = { ...prev };
          delete updated[file.id];
          return updated;
        });

        let errorMessage = "Failed to convert file";
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            errorMessage = "Authentication error. Please login again";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        toast({
          title: "Conversion failed",
          description: `${errorMessage} for ${file.name}`,
          variant: "destructive",
        });
      }
    }

    // Check if all files are processed
    if (Object.keys(uploadingFiles).length === 0) {
      setIsUploading(false);
    }
  };

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-400/30 p-12 transition-colors ${
        isDragging ? "border-blue-400/60 bg-blue-900/30" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className="mb-4 h-12 w-12 text-blue-100/60 hover:scale-110" />
      <h3 className="mb-2 text-lg font-medium text-white">Drag & Drop PDF file here</h3>
      <p className="mb-4 text-sm text-blue-100/60 hover:scale-105">or</p>
      <Button
        onClick={handleButtonClick}
        variant="secondary"
        className="bg-blue-800/50 text-white hover:bg-blue-800/70 hover:scale-110"
        disabled={isUploading}
      >
        <Paperclip className="mr-2 h-4 w-4" />
        {isUploading ? "Uploading..." : "Choose PDF file"}
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
        accept=".pdf,application/pdf"
        multiple
        disabled={isUploading}
      />
      <div className="mt-4 flex items-center text-xs text-blue-100/60">
        <AlertCircle className="mr-1 h-3 w-3" />
        <span>Maximum upload size: 10 MB</span>
      </div>
    </div>
  );
}