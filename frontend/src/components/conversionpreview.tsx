"use client"

import { useState } from "react"
import type { File } from "@/types/index"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/Button"
import { Download } from "lucide-react"
import axios from "axios"
interface ConversionPreviewProps {
  file: File
}

export function ConversionPreview({ file }: ConversionPreviewProps) {
  const [activeTab, setActiveTab] = useState<string>("xml")
  const [xmlContent, setXmlContent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch XML content from backend
  const fetchXmlContent = async () => {
    if (xmlContent) return // Already fetched

    setIsLoading(true)
    try {
      const response = await axios.get(`http://localhost:3001/api/conversions/${file.id}`)

      if (!response) throw new Error("Failed to fetch XML content")

      const data = await response.data
      setXmlContent(data.content)
    } catch (error) {
      console.error("Error fetching XML content:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch content when tab changes to XML
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === "xml" || value === "split") {
      fetchXmlContent()
    }
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(`http://your-backend-url/api/files/${file.id}/download`)

      if (!response.ok) throw new Error("Download failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = file.name.replace(".pdf", ".xml")
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList>
            <TabsTrigger value="xml">XML</TabsTrigger>
            <TabsTrigger value="pdf">Original PDF</TabsTrigger>
            <TabsTrigger value="split">Split View</TabsTrigger>
          </TabsList>

          <TabsContent value="xml" className="mt-4">
            <div className="relative rounded-md border bg-muted p-4">
              {isLoading ? (
                <div className="flex h-40 items-center justify-center">
                  <p className="text-muted-foreground">Loading XML content...</p>
                </div>
              ) : (
                <pre className="overflow-x-auto text-sm">
                  <code className="text-sm">{xmlContent || "No XML content available"}</code>
                </pre>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pdf" className="mt-4">
            <div className="flex h-96 items-center justify-center rounded-md border bg-muted">
              <iframe
                src={`http://your-backend-url/api/files/${file.id}/pdf-preview`}
                className="h-full w-full rounded-md"
                title="PDF Preview"
              />
            </div>
          </TabsContent>

          <TabsContent value="split" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex h-96 items-center justify-center rounded-md border bg-muted">
                <iframe
                  src={`http://your-backend-url/api/files/${file.id}/pdf-preview`}
                  className="h-full w-full rounded-md"
                  title="PDF Preview"
                />
              </div>
              <div className="relative rounded-md border bg-muted p-4">
                {isLoading ? (
                  <div className="flex h-80 items-center justify-center">
                    <p className="text-muted-foreground">Loading XML content...</p>
                  </div>
                ) : (
                  <pre className="h-80 overflow-auto text-sm">
                    <code className="text-sm">{xmlContent || "No XML content available"}</code>
                  </pre>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download XML
        </Button>
      </div>
    </div>
  )
}
