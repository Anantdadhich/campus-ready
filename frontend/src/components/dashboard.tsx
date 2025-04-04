"use client"

import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUploader } from "@/components/fileuploader";
import { FileList } from "@/components/filelist";
import type { File } from "@/types/index";
import axios from "axios";
import { ConversionPreview } from "@/components/conversionpreview";
import { useAuth } from "./authcontext";
import { Menu, X } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function DashboardPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [conversions, setConversions] = useState<File[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<"convert" | "history">("convert");
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchConversions = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/conversions`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        console.log("Conversions:", response.data.conversions);
        setConversions(response.data.conversions || []);
      } catch (error) {
        console.error("Error fetching conversions:", error);
      }
    };
    if (token) fetchConversions();
  }, [token]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial state based on window size
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFileUpload = (newFiles: File[]) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      newFiles.forEach((newFile) => {
        const existingFileIndex = updatedFiles.findIndex((f) => f.id === newFile.id);
        if (existingFileIndex >= 0) {
          updatedFiles[existingFileIndex] = newFile;
        } else {
          updatedFiles.push(newFile);
        }
      });
      return updatedFiles;
    });
  };

  const handleFileRemove = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
    if (selectedFile?.id === fileId) {
      setSelectedFile(null);
    }
  };

  const handleFileView = (file: File) => {
    setSelectedFile(file);
   
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-950 via-purple-900 to-blue-900">
      {/* Background effects */}
      <div className="absolute top-40 right-40 h-64 w-64 rounded-full bg-white/5 blur-xl"></div>
      <div className="absolute -top-20 left-20 h-80 w-80 rounded-full bg-purple-500/10 blur-xl"></div>
      <div className="absolute bottom-20 left-1/4 h-96 w-96 rounded-full bg-blue-400/10 blur-xl"></div>
      <div className="absolute top-80 left-40 h-16 w-16 rounded-full bg-green-500/30 blur-sm"></div>
      <div className="absolute bottom-40 right-1/4 h-8 w-8 rounded-full bg-red-500/40 blur-sm"></div>
      <div className="absolute top-1/3 right-20 h-6 w-6 rounded-full bg-yellow-400/40 blur-sm"></div>
      <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full border border-blue-400/20"></div>
      <div className="absolute top-1/3 right-1/4 h-60 w-60 rounded-full border border-blue-400/15"></div>
      <div className="absolute bottom-1/4 left-60 h-80 w-80 rounded-full border border-purple-400/10"></div>
      <div className="absolute top-0 right-0 h-full w-1/2 border-l border-blue-400/5 rounded-full transform translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 h-3/4 w-3/4 border-t border-purple-400/5 rounded-full transform -translate-y-1/4"></div>
      <div className="absolute top-1/4 left-1/4 h-2 w-2 rounded-full bg-green-400/80"></div>
      <div className="absolute top-1/2 right-1/3 h-3 w-3 rounded-full bg-orange-400/70"></div>
      <div className="absolute bottom-1/3 right-1/2 h-2 w-2 rounded-full bg-white/70"></div>

      <div className="relative z-10 flex h-screen">
        {/* Mobile sidebar toggle button */}
        <div className="fixed top-4 left-4 z-50 lg:hidden">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleSidebar}
            className="border-white/20 bg-white/10 text-white hover:bg-white/20"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>

        {/* Sidebar */}
        <div className={`fixed lg:relative w-64 h-full transition-all duration-300 ease-in-out z-40 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="h-full backdrop-blur-sm bg-white/10 border-r border-white/10 p-4 space-y-6">
            <div className="pt-10 lg:pt-4">
              <h2 className="text-xl font-bold tracking-tight text-white">Dashboard</h2>
              <p className="text-sm text-blue-100/80">
                Welcome, {user?.name || "User"}!
              </p>
            </div>
            
            <div className="space-y-2 pt-4">
              <h3 className="text-xs uppercase text-blue-100/60 font-medium px-2">Navigation</h3>
              <button 
                onClick={() => setActiveView("convert")}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center text-sm font-medium
                  ${activeView === "convert" 
                    ? "bg-white/20 text-white" 
                    : "text-blue-100/80 hover:bg-white/10"}`}
              >
                Convert
              </button>
              <button 
                onClick={() => setActiveView("history")}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center text-sm font-medium
                  ${activeView === "history" 
                    ? "bg-white/20 text-white" 
                    : "text-blue-100/80 hover:bg-white/10"}`}
              >
                History
              </button>
            </div>
            
            <div className="space-y-2 pt-4">
              <h3 className="text-xs uppercase text-blue-100/60 font-medium px-2">Quick Stats</h3>
              <div className="p-3 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100/80 text-xs">Total</span>
                  <span className="text-sm font-bold text-white">{conversions.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100/80 text-xs">Pending</span>
                  <span className="text-sm font-bold text-yellow-400">
                    {files.filter(f => f.status === "uploading").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100/80 text-xs">Completed</span>
                  <span className="text-sm font-bold text-green-400">
                    {files.filter(f => f.status === "success").length}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 pt-4">
              <h3 className="text-xs uppercase text-blue-100/60 font-medium px-2">Recent</h3>
              <div className="p-2 space-y-2">
                {conversions.length > 0 ? (
                  conversions.slice(0, 3).map((file) => (
                    <div key={file.id} className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition-all cursor-pointer" onClick={() => handleFileView(file)}>
                      <p className="font-medium text-white text-xs truncate">{file.name}</p>
                      <p className="text-xs text-blue-100/70">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-blue-100/70 px-2">No recent activity.</p>
                )}
              </div>
            </div>
          </div>
        </div>

       
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-35' : 'ml-0'}`}>
          <div className="p-4 lg:p-6 h-full overflow-auto">
            <div className="space-y-6 backdrop-blur-sm bg-white/5 p-4 lg:p-8 rounded-xl border border-white/10 shadow-xl mt-14 lg:mt-6">
             
              <div className="flex justify-between items-center ">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
                    {activeView === "convert" ? "Convert Documents" : "Conversion History"}
                  </h2>
                  <p className="text-sm lg:text-base text-blue-100/80">
                    {activeView === "convert" 
                      ? "Upload your PDF files to convert them to XML." 
                      : "View and manage your past conversions."}
                  </p>
                </div>
              </div>

             
              {activeView === "convert" ? (
                <div className="grid gap-4 lg:grid-cols-3">
                  <Card className="lg:col-span-3 bg-white/10 border-white/20 backdrop-blur-sm text-white">
                    <CardHeader>
                      <CardTitle className="text-white text-xl">Upload PDF</CardTitle>
                      <CardDescription className="text-blue-100/70">Upload your PDF file to convert it to XML.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FileUploader onFileUpload={handleFileUpload} />
                      {files.length > 0 && (
                        <div className="mt-6">
                          <h3 className="mb-3 font-medium text-white">Uploaded Files</h3>
                          <div className="overflow-x-auto -mx-4 px-4">
                            <FileList
                              files={files}
                              onFileRemove={handleFileRemove}
                              onFileView={handleFileView}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
                  <CardHeader>
                    <CardTitle className="text-white">Conversion History</CardTitle>
                    <CardDescription className="text-blue-100/70">View all your past conversions.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {conversions.length > 0 ? (
                      <div className="space-y-4 overflow-x-auto -mx-4 px-4">
                        <div className="min-w-full">
                          {conversions.map((file) => (
                            <div key={file.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-md border border-white/20 p-4 bg-white/5 hover:bg-white/10 transition-all duration-200 mb-3">
                              <div className="mb-3 sm:mb-0">
                                <p className="font-medium text-white truncate max-w-xs">{file.name}</p>
                                <p className="text-xs text-blue-100/70">
                                  {new Date().toLocaleDateString()} • {file.status === "success" ? "Completed" : file.status}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleFileView(file)}
                                  className="border-white/20 text-white hover:bg-white/10 hover:text-white"
                                >
                                  View
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleFileRemove(file.id)}
                                  className="border-white/20 text-white hover:bg-white/10 hover:text-white"
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-blue-100/70">No conversion history available.</p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Document Preview */}
              {selectedFile && (
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white mt-6">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-white">Document Preview</CardTitle>
                        <CardDescription className="text-blue-100/70">
                          View and download your converted document.
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Close
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    <ConversionPreview file={selectedFile} />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}