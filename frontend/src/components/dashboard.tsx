/*"use client";

import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUploader } from "@/components/fileuploader";
import { FileList } from "@/components/filelist";
import type { File } from "@/types/index";
import axios from "axios";

export function DashboardPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [conversions, setConversions] = useState<File[]>([]);

  useEffect(() => {
    const fetchConversions = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/conversions");
  
        if (response.status === 200) {
          setConversions(response.data.conversions || []);
        } else {
          console.warn("Unexpected response status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching conversions:", error);
      }
    };
  
    fetchConversions();
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
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Convert your PDF files to XML and manage your conversions.</p>
      </div>

      <Tabs defaultValue="convert" className="space-y-4">
        <TabsList>
          <TabsTrigger value="convert">Convert</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="convert" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Upload PDF</CardTitle>
                <CardDescription>Upload your PDF file to convert it to XML.</CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploader onFileUpload={handleFileUpload} />
                {files.length > 0 && (
                  <div className="mt-6">
                    <h3 className="mb-3 font-medium">Uploaded Files</h3>
                    <FileList files={files} onFileRemove={handleFileRemove} onFileView={handleFileView} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

*/
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
  const { user, token } = useAuth();

  // Fetch user's conversions from backend
  useEffect(() => {
    const fetchConversions = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/conversions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setConversions(response.data.conversions || []);
        } else {
          console.warn("Unexpected response status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching conversions:", error);
      }
    };
    if (token) {
      fetchConversions();
    }
  }, [token]);

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
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-950 via-purple-900 to-blue-900">
     
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

   
      <div className="relative z-10 container mx-auto p-6">
        <div className="space-y-6 backdrop-blur-sm bg-white/5 p-8 rounded-xl border border-white/10 shadow-xl">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
            <p className="text-blue-100/80">
              Welcome back, {user?.name || "User"}! Convert your PDF files to XML and manage your conversions.
            </p>
          </div>

          <Tabs defaultValue="convert" className="space-y-4">
            <TabsList className="bg-white/10 border border-white/20">
              <TabsTrigger value="convert" className="data-[state=active]:bg-white/20 text-white">Convert</TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-white/20 text-white">History</TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-white/20 text-white">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="convert" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2 bg-white/10 border-white/20 backdrop-blur-sm text-white">
                  <CardHeader>
                    <CardTitle className="text-white">Upload PDF</CardTitle>
                    <CardDescription className="text-blue-100/70">Upload your PDF file to convert it to XML.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FileUploader onFileUpload={handleFileUpload} />
                    {files.length > 0 && (
                      <div className="mt-6">
                        <h3 className="mb-3 font-medium text-white">Uploaded Files</h3>
                        <FileList
                          files={files}
                          onFileRemove={handleFileRemove}
                          onFileView={handleFileView}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white hover:bg-white/15 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-white">Quick Stats</CardTitle>
                    <CardDescription className="text-blue-100/70">Your conversion activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-100/80">Total Conversions</span>
                        <span className="text-xl font-bold text-white">{conversions.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-100/80">Pending</span>
                        <span className="text-xl font-bold text-yellow-400">
                          
                          {files.filter(f => f.status === "uploading").length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-100/80">Completed</span>
                        <span className="text-xl font-bold text-green-400">
                          {files.filter(f => f.status === "success").length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
                    <div className="space-y-4">
                      {conversions.map((file) => (
                        <div key={file.id} className="flex items-center justify-between rounded-md border border-white/20 p-4 bg-white/5 hover:bg-white/10 transition-all duration-200">
                          <div>
                            <p className="font-medium text-white">{file.name}</p>
                            <p className="text-xs text-blue-100/70">
                              {new Date().toLocaleDateString()}
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
                  ) : (
                    <p className="text-sm text-blue-100/70">No conversion history available.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
                <CardHeader>
                  <CardTitle className="text-white">Conversion Settings</CardTitle>
                  <CardDescription className="text-blue-100/70">Configure your PDF to XML conversion settings.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-blue-100 block">Output Format</label>
                      <select className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option value="xml">XML</option>
                        <option value="json">JSON</option>
                        <option value="html">HTML</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-blue-100 block">Preserve Formatting</label>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 rounded border-white/20 bg-white/10 text-green-500"
                          defaultChecked
                        />
                        <span className="ml-2 text-sm text-blue-100/80">Maintain original document formatting</span>
                      </div>
                    </div>
                    
                    <Button className="mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700">
                      Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {selectedFile && selectedFile.status === "success" && (
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white mt-6">
              <CardHeader>
                <CardTitle className="text-white">Preview</CardTitle>
                <CardDescription className="text-blue-100/70">View the converted XML document.</CardDescription>
              </CardHeader>
              <CardContent>
                <ConversionPreview file={selectedFile} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}