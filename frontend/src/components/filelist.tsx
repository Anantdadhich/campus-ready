
"use client";

import { FileText, X, Download, Eye } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/Button";
import { useAuth } from "./authcontext";
import axios from "axios";
import { useState } from "react";
import { useToast } from "@/components/ui/toastui";

interface File {
  id: string;
  name: string;
  size?: number;
  type?: string;
  status: "uploading" | "success" | "error";
  progress: number;
  originalFile?: globalThis.File;
}

interface FileListProps {
  files: File[];
  onFileRemove: (fileId: string) => void;
  onFileView: (file: File) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function FileList({ files, onFileRemove, onFileView }: FileListProps) {
  const { token } = useAuth();
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null);
  const [processingFileId, setProcessingFileId] = useState<string | null>(null);
  const { toast } = useToast();
    
  const handleDownload = async (file: File) => {
    if (downloadingFileId === file.id) return;
    
    try {
      setDownloadingFileId(file.id);
      
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "You need to be logged in to download files",
          variant: "destructive",
        });
        return;
      }

      const response = await axios.get(`${API_URL}/api/conversions/${file.id}/download`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (!response.data) {
        throw new Error("No data received from the server");
      }

      const contentDisposition = response.headers["content-disposition"];
      let filename = file.name.replace(/\.pdf$/i, ".xml");
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) filename = filenameMatch[1];
      }

      const blob = new Blob([response.data], { type: "application/xml" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      toast({
        title: "Download Complete",
        description: `${filename} has been downloaded successfully`,
      });
    } catch (error) {
      console.error("Download failed:", error);
      
      let errorMessage = "Download failed";
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = "Authentication error. Please login again";
        } else if (error.response?.status === 404) {
          errorMessage = "File not found on server";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      toast({
        title: "Download Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setDownloadingFileId(null);
    }
  };

  const handleFileView = (file: File) => {
    if (processingFileId === file.id) return;
    
    setProcessingFileId(file.id);
    
    // Small delay to show processing state
    setTimeout(() => {
      onFileView(file);
      setProcessingFileId(null);
    }, 300);
  };

  const handleFileRemove = (fileId: string) => {
    if (downloadingFileId === fileId || processingFileId === fileId) return;
    
    setProcessingFileId(fileId);
    
    // Small delay to show processing state
    setTimeout(() => {
      onFileRemove(fileId);
      setProcessingFileId(null);
    }, 300);
  };

  return (
    <div className="space-y-4">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between rounded-md border border-blue-800/30 bg-blue-900/20 p-3 transition-all duration-200 hover:bg-blue-900/30"
        >
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-blue-100/70" />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-white">{file.name}</p>
              {file.status === "success" && <p className="text-xs text-green-400">Success!</p>}
              {file.status === "error" && <p className="text-xs text-red-400">Conversion failed</p>}
              {processingFileId === file.id && <p className="text-xs text-blue-300 animate-pulse">Processing...</p>}
            </div>
          </div>

          {file.status === "uploading" && (
            <div className="ml-4 flex-1 max-w-md">
              <Progress value={file.progress} className="h-2 bg-blue-800/50" />
              <p className="mt-1 text-right text-xs text-blue-100/70">{file.progress}%</p>
            </div>
          )}

          {file.status === "success" && (
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-blue-100/70 hover:bg-blue-800/30 hover:text-white transition-colors"
                onClick={() => handleFileView(file)}
                disabled={processingFileId === file.id}
              >
                <Eye className={`h-4 w-4 ${processingFileId === file.id ? 'animate-pulse' : ''}`} />
                <span className="sr-only">View</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-blue-100/70 hover:bg-blue-800/30 hover:text-white transition-colors"
                onClick={() => handleDownload(file)}
                disabled={downloadingFileId === file.id || processingFileId === file.id}
              >
                <Download className={`h-4 w-4 ${downloadingFileId === file.id ? 'animate-spin' : ''}`} />
                <span className="sr-only">Download</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-blue-100/70 hover:bg-blue-800/30 hover:text-white transition-colors"
                onClick={() => handleFileRemove(file.id)}
                disabled={downloadingFileId === file.id || processingFileId === file.id}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          )}

          {file.status === "error" && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-blue-100/70 hover:bg-blue-800/30 hover:text-white transition-colors"
              onClick={() => handleFileRemove(file.id)}
              disabled={processingFileId === file.id}
            >
              <X className={`h-4 w-4 ${processingFileId === file.id ? 'animate-pulse' : ''}`} />
              <span className="sr-only">Remove</span>
            </Button>
          )}
        </div>
      ))}

      {files.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <FileText className="h-10 w-10 text-blue-100/50 mb-2" />
          <p className="text-blue-100/70">No files uploaded yet</p>
          <p className="text-xs text-blue-100/50 mt-1">Upload a PDF file to convert it to XML</p>
        </div>
      )}
    </div>
  );
}