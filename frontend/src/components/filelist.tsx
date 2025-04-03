"use client";

import { FileText, X, Download, Eye } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/Button";
import { useAuth } from "./authcontext";
import axios from "axios";

// Define the File interface
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

  const handleDownload = async (file: File) => {
    try {
      if (!token) {
        console.error("Authentication token is missing");
        return;
      }
      console.log("Sending Token:", token);

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

      // Extract filename from Content-Disposition header or use file.name
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
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Use unknown type and safely handle the error
      console.error("Download failed:", error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <div className="space-y-4">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between rounded-md border border-blue-800/30 bg-blue-900/20 p-3"
        >
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-blue-100/70" />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-white">{file.name}</p>
              {file.status === "success" && <p className="text-xs text-green-400">Success!</p>}
              {file.status === "error" && <p className="text-xs text-red-400">Conversion failed</p>}
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
                className="h-8 w-8 p-0 text-blue-100/70 hover:bg-blue-800/30 hover:text-white"
                onClick={() => onFileView(file)}
              >
                <Eye className="h-4 w-4" />
                <span className="sr-only">View</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-blue-100/70 hover:bg-blue-800/30 hover:text-white"
                onClick={() => handleDownload(file)}
              >
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-blue-100/70 hover:bg-blue-800/30 hover:text-white"
                onClick={() => onFileRemove(file.id)}
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
              className="h-8 w-8 p-0 text-blue-100/70 hover:bg-blue-800/30 hover:text-white"
              onClick={() => onFileRemove(file.id)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}