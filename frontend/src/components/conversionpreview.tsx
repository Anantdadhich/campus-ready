
"use client";

import { useState, useEffect } from "react";
import type { File } from "@/types/index";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/Button";
import { Download, RefreshCw, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { useAuth } from "./authcontext";
import { useToast } from "@/components/ui/toastui";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ConversionPreviewProps {
  file: File;
}

export function ConversionPreview({ file }: ConversionPreviewProps) {
  const [activeTab, setActiveTab] = useState<string>("xml");
  const [xmlContent, setXmlContent] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const { toast } = useToast();

  const fetchXmlContent = async () => {
    if (!file?.id) {
      setError("File info is incomplete");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (!token) {
        throw new Error("Auth token is missing");
      }
      
      const response = await axios.get(`${API_URL}/api/conversions/${file.id}`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
        withCredentials: true,
      });
      
      if (response.status !== 200) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const xml = response.data.xmlContent || response.data.conversion?.xmlContent;
      if (!xml) {
        throw new Error("No XML content found in response");
      }
      
      setXmlContent(xml);
    } catch (error) {
      console.error("Error fetching XML content:", error);
      
      let errorMessage = "Failed to load XML content";
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = "Authentication error. Please login again";
        } else if (error.response?.status === 404) {
          errorMessage = "File not found on server";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPdfPreview = async () => {
    if (!file?.id) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!token) {
        throw new Error("Authentication token is missing");
      }

      // Get the original PDF for preview
      const response = await axios.get(`${API_URL}/api/conversions/${file.id}/preview`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob',
        withCredentials: true,
      });

      if (response.status !== 200) {
        throw new Error(`Server error: ${response.status}`);
      }

      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);


      setTotalPages(Math.floor(Math.random() * 5) + 1);

    } catch (error) {
      console.error("Error fetching PDF preview:", error);
      
      let errorMessage = "Failed to load PDF preview";
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = "Authentication error. Please login again";
        } else if (error.response?.status === 404) {
          errorMessage = "PDF file not found on server";
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "xml" && file?.id && token) {
      fetchXmlContent();
    } else if (activeTab === "pdf" && file?.id && token) {
      fetchPdfPreview();
    }

   
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [activeTab, file?.id, token]);

  const handleDownload = async (type: 'xml' | 'pdf' = 'xml') => {
    if (isDownloading) return;
    
    try {
      setIsDownloading(true);
      setError(null);
      
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      
      const endpoint =`${API_URL}/api/conversions/${file.id}/download`;
      
      const response = await axios.get(endpoint, {
        responseType: "blob",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true
      });

      if (response.status !== 200) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const contentType = type === 'xml' ? 'application/xml' : 'application/pdf';
      const extension = type === 'xml' ? '.xml' : '.pdf';
      
      const contentDisposition = response.headers['content-disposition'];
      let filename = file.name.replace(/\.(pdf|xml)$/i, extension);
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      toast({
        title: "Download Complete",
        description: `${filename} has been downloaded successfully`,
      });
    } catch (error) {
      console.error("Download error:", error);
      
      let errorMessage = "Download failed";
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = "Please login again to download";
        } else if (error.response?.status === 403) {
          errorMessage = "You don't have download permission";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      toast({
        title: "Download Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="xml">XML Output</TabsTrigger>
            <TabsTrigger value="pdf">Original PDF</TabsTrigger>
          </TabsList>

          <TabsContent value="xml" className="mt-4">
            <div className="relative rounded-md border bg-muted p-4">
              {isLoading ? (
                <div className="flex h-40 items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">Loading XML content...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex h-40 flex-col items-center justify-center text-destructive">
                  <p>{error}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={fetchXmlContent}
                    className="mt-2"
                  >
                    Retry
                  </Button>
                </div>
              ) : (
                <pre className="max-h-96 overflow-x-auto overflow-y-auto text-sm">
                  <code className="text-sm whitespace-pre-wrap break-words">
                    {xmlContent || "No XML content available"}
                  </code>
                </pre>
              )}
            </div>
            <div className="flex justify-end mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDownload('xml')}
                disabled={isLoading || isDownloading || !xmlContent}
              >
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? "Preparing download..." : "Download XML"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="pdf" className="mt-4">
            <div className="relative rounded-md border bg-muted p-4">
              {isLoading ? (
                <div className="flex h-40 items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">Loading PDF preview...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex h-40 flex-col items-center justify-center text-destructive">
                  <p>{error}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={fetchPdfPreview}
                    className="mt-2"
                  >
                    Retry
                  </Button>
                </div>
              ) : pdfUrl ? (
                <div className="flex flex-col items-center">
                  <iframe 
                    src={`${pdfUrl}#page=${currentPage}`}
                    className="w-full h-96 border-0" 
                    title="PDF Preview"
                  />
                  <div className="flex items-center justify-between w-full mt-2">
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handlePageChange('prev')}
                        disabled={currentPage <= 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handlePageChange('next')}
                        disabled={currentPage >= totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                    <p className="text-muted-foreground">No PDF preview available</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={fetchPdfPreview}
                      className="mt-2"
                    >
                      Load PDF
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDownload('pdf')}
                disabled={isLoading || isDownloading || !pdfUrl}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Original PDF
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}