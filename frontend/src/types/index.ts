export interface File {
    id: string
    name: string
    size: number
    type: string
    status: "uploading" | "success" | "error"
    progress: number
    originalFile?: globalThis.File
    createdAt?: string
    xmlUrl?: string
    pdfUrl?: string
  }
  
  