"use client"

import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUploader } from "@/components/fileuploader";
import { FileList } from "@/components/filelist";
import type { File } from "@/types/index";
import axios from "axios";
import { ConversionPreview } from "@/components/conversionpreview";
import { useAuth } from "./authcontext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function DashboardPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [conversions, setConversions] = useState<File[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
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



  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-950 via-purple-900 to-blue-900">
      {/* Background decorative elements */}
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

   
     

    
     

      {/* Main content */}
      <div className="relative z-10 container mx-auto p-4 lg:p-6">
        <div className="space-y-6 backdrop-blur-sm bg-white/5 p-4 lg:p-8 rounded-xl border border-white/10 shadow-xl mt-14 lg:mt-0">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">Dashboard</h2>
              <p className="text-sm lg:text-base text-blue-100/80">
                Welcome back, {user?.name || "User"}! Convert your PDF files to XML and manage your conversions.
              </p>
            </div>
           
          </div>

          <Tabs defaultValue="convert" className="space-y-4">
            <div className="flex overflow-x-auto pb-2 -mx-4 px-4">
              <TabsList className="bg-white/10 border border-white/20 w-full flex">
                <TabsTrigger value="convert" className="data-[state=active]:bg-white/20 text-white flex-1">Convert</TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-white/20 text-white flex-1">History</TabsTrigger>
              
              </TabsList>
            </div>

            <TabsContent value="convert" className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2 bg-white/10 border-white/20 backdrop-blur-sm text-white">
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
                
                <div className="space-y-4">
                  <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white hover:bg-white/15 transition-all duration-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-lg">Quick Stats</CardTitle>
                      <CardDescription className="text-blue-100/70 text-xs">Your conversion activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-100/80 text-sm">Total Conversions</span>
                          <span className="text-xl font-bold text-white">{conversions.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-blue-100/80 text-sm">Pending</span>
                          <span className="text-xl font-bold text-yellow-400">
                            {files.filter(f => f.status === "uploading").length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-blue-100/80 text-sm">Completed</span>
                          <span className="text-xl font-bold text-green-400">
                            {files.filter(f => f.status === "success").length}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white hidden lg:block">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-lg">Recent Activity</CardTitle>
                      <CardDescription className="text-blue-100/70 text-xs">Your latest conversions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {conversions.length > 0 ? (
                        <div className="space-y-2">
                          {conversions.slice(0, 3).map((file) => (
                            <div key={file.id} className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition-all">
                              <p className="font-medium text-white text-sm truncate">{file.name}</p>
                              <p className="text-xs text-blue-100/70">
                                {new Date().toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-blue-100/70">No recent activity.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
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
            </TabsContent>

           
          </Tabs>

          {selectedFile && selectedFile.status === "success" && (
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white mt-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white">Preview</CardTitle>
                    <CardDescription className="text-blue-100/70">View the converted XML document.</CardDescription>
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
  );
}