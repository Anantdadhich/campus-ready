"use client"

import type React from "react"
import axios from "axios"
import { useState, useRef } from "react"

import { Upload, Paperclip } from "lucide-react"
import type { File } from "@/types/index"
import { v4 as uuidv4 } from "uuid"
import { useToast } from "./ui/toastui"
import { Button } from "./ui/Button"
import { useAuth } from "./authcontext"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface FileUploaderProps {
  onFileUpload: (files: File[]) => void
}

export function FileUploader({ onFileUpload }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
 const {token}=useAuth()

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files)
      processFiles(droppedFiles)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      processFiles(selectedFiles)
    }
  }
   /*
  const processFiles = async (fileList: globalThis.File[]) => {
    // Validate files
    const pdfFiles = fileList.filter((file) => file.type === "application/pdf")

    if (pdfFiles.length === 0) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF files only",
        variant: "destructive",
      })
      return
    }

    // Check file size
    const oversizedFiles = pdfFiles.filter((file) => file.size > 10 * 1024 * 1024) // 10MB limit

    if (oversizedFiles.length > 0) {
      toast({
        title: "File too large",
        description: "Files must be less than 10MB",
        variant: "destructive",
      })
      return
    }

    // Create file objects for UI
    const newFiles: File[] = pdfFiles.map((file) => ({
      id: uuidv4(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0,
      originalFile: file,
    }))

    // Update UI with new files
    onFileUpload(newFiles)
    setIsUploading(true)

    // Upload files to backend
    for (const file of newFiles) {
      try {
        const formData = new FormData()
        if (!file.originalFile) {
          console.error("File is missing");
          return;
        }

        formData.append("file", file.originalFile as globalThis.File)

       
        const response = await axios.post(`${API_URL}/api/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "multipart/form-data",
          },
        })
    

        if (response.status !== 200) {
          throw new Error("Conversion failed")
        }

        file.id = response.data.conversionid;
        file.status = "success"
        file.progress = 100
        onFileUpload([{ ...file }])

        toast({
          title: "Conversion successful",
          description: `${file.name} has been converted to XML`,
        })
      } catch (error) {
        file.status = "error"
        file.progress = 0
        onFileUpload([{ ...file }])

        toast({
          title: "Conversion failed",
          description: `Failed to convert ${file.name}`,
          variant: "destructive",
        })
      }
    }

    setIsUploading(false)
  }
  */
 // In FileUploader
const processFiles = async (fileList: globalThis.File[]) => {
  const pdfFiles = fileList.filter((file) => file.type === "application/pdf");
  if (pdfFiles.length === 0) {
    toast({ title: "Invalid file type", description: "Please upload PDF files only", variant: "destructive" });
    return;
  }

  const newFiles: File[] = pdfFiles.map((file) => ({
    id: uuidv4(),
    name: file.name,
    size: file.size,
    type: file.type,
    status: "uploading",
    progress: 0,
    originalFile: file,
  }));

  onFileUpload(newFiles);
  setIsUploading(true);

  for (const file of newFiles) {
    try {
      const formData = new FormData();
      formData.append("file", file.originalFile as globalThis.File);

      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      file.id = response.data.conversionid; // Update with backend ID
      file.status = "success";
      file.progress = 100;
      onFileUpload([{ ...file }]);
      toast({ title: "Conversion successful", description: `${file.name} has been converted to XML` });
    } catch (error) {
      file.status = "error";
      file.progress = 0;
      onFileUpload([{ ...file }]);
      toast({ title: "Conversion failed", description: `Failed to convert ${file.name}`, variant: "destructive" });
    }
  }

  setIsUploading(false);
};
  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-400/30 p-12 transition-colors ${
        isDragging ? "border-blue-400/60 bg-blue-900/30" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className="mb-4 h-12 w-12 text-blue-100/60" />
      <h3 className="mb-2 text-lg font-medium text-white">Drag&Drop file here</h3>
      <p className="mb-4 text-sm text-blue-100/60">or</p>
      <Button
        onClick={handleButtonClick}
        variant="secondary"
        className="bg-blue-800/50 text-white hover:bg-blue-800/70"
        disabled={isUploading}
      >
        <Paperclip className="mr-2 h-4 w-4" />
        {isUploading ? "Uploading..." : "Choose file"}
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
        accept=".pdf"
        multiple
        disabled={isUploading}
      />
      <p className="mt-4 text-xs text-blue-100/60">Maximum upload size 10 MB</p>
    </div>
  )
}

