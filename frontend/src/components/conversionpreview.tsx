"use client";

import { useState, useEffect } from "react";
import type { File } from "@/types/index";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";
import axios from "axios";
import { useAuth } from "./authcontext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ConversionPreviewProps {
  file: File;
}

export function ConversionPreview({ file }: ConversionPreviewProps) {
  const [activeTab, setActiveTab] = useState<string>("xml");
  const [xmlContent, setXmlContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchXmlContent = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/conversions/${file.id}`, {
        headers: { Authorization: `Bearer ${token}` },
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
      setError( "Failed to load XML content");
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "xml") {
      fetchXmlContent();
    }
  }, [activeTab, token]);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/api/conversions/${file.id}/download`, {
        responseType: "blob",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true
      });

      if (response.status !== 200) {
        throw new Error(`Server responded with ${response.status}`);
      }
      const contentType = response.headers['content-type'] || 'application/xml';
      
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, ".xml");
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error: any) {
      let errorMessage = "Download failed";
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Please login again to download";
        } else if (error.response.status === 403) {
          errorMessage = "You don't have download permission";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
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
            <TabsTrigger value="xml">XML</TabsTrigger>
          </TabsList>

          <TabsContent value="xml" className="mt-4">
            <div className="relative rounded-md border bg-muted p-4">
              {isLoading ? (
                <div className="flex h-40 items-center justify-center">
                  <p className="text-muted-foreground">Loading XML content...</p>
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
                <pre className="overflow-x-auto text-sm">
                  <code className="text-sm">
                    {xmlContent || "No XML content available"}
                  </code>
                </pre>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownload}
          disabled={isLoading || !xmlContent}
        >
          <Download className="mr-2 h-4 w-4" />
          {isLoading ? "Preparing download..." : "Download XML"}
        </Button>
      </div>
    </div>
  );
}