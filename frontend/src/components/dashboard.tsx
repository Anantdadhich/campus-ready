"use client"

import { Button } from "@/components/ui/Button"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUploader } from "@/components/fileuploader"
import { FileList } from "@/components/filelist"
import type { File } from "@/types/index"

export function DashboardPage() {
  const [files, setFiles] = useState<File[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [conversions, setConversions] = useState<File[]>([])

  useEffect(() => {
    const fetchConversions = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/conversions")
        if (!response.ok) throw new Error("Failed to fetch conversions")
        const data = await response.json()
        setConversions(data.conversions)
      } catch (error) {
        console.error("Error fetching conversions:", error)
      }
    }
    fetchConversions()
  }, [])

  const handleFileUpload = (newFiles: File[]) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles]
      newFiles.forEach((newFile) => {
        const existingFileIndex = updatedFiles.findIndex((f) => f.id === newFile.id)
        if (existingFileIndex >= 0) {
          updatedFiles[existingFileIndex] = newFile
        } else {
          updatedFiles.push(newFile)
        }
      })
      return updatedFiles
    })
  }

  const handleFileRemove = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId))
    if (selectedFile?.id === fileId) {
      setSelectedFile(null)
    }
  }

  const handleFileView = (file: File) => {
    setSelectedFile(file)
  }

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
  )
}
