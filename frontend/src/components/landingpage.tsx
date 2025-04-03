"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "./ui/Button"

export function LandingPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden  bg-gradient-to-br from-blue-950 via-purple-900 to-blue-900">
     
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

     
      <header className="container z-10 mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-white md:text-2xl">
            Convo
          </div>
          
          <div className="flex  gap-2 sm:flex-row sm:gap-4">
            <Button 
              asChild 
              variant="outline" 
              className="text-white border-white/20 hover:bg-white/10 hover:text-white text-sm px-4 py-2 md:text-base md:px-6 md:py-2"
            >
              <Link href="/auth/login" className="w-full text-center">
                Login
              </Link>
            </Button>
            <Button 
              asChild 
              className="rounded-full bg-white/20 px-4 py-2 text-white hover:bg-white/30 text-sm md:text-base md:px-8 md:py-2"
            >
              <Link href="/auth/register" className="w-full text-center">
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </header>


      <main className="container relative z-10 mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight ">
            <span className="text-green-400">Convert your</span>
            <br />
            <span className="text-white">file easily</span>
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-blue-100/80">
            Convert your PDF files to XML while preserving document structure and formatting.
          </p>

          <div className="mx-auto mb-8 max-w-3xl">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg bg-white/5 p-6 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-medium text-white">Upload PDF</h3>
                <p className="text-blue-100/70">Easily upload your PDF documents through our intuitive interface.</p>
              </div>

              <div className="rounded-lg bg-white/5 p-6 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-medium text-white">Convert</h3>
                <p className="text-blue-100/70">
                  Our system converts your PDF to XML while preserving structure and formatting.
                </p>
              </div>

              <div className="rounded-lg bg-white/5 p-6 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-medium text-white">Download</h3>
                <p className="text-blue-100/70">
                  Download your converted XML files or view them directly in the browser.
                </p>
              </div>
            </div>

            <div className="mt-12">
              <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-8 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/20">
                <Link href="/auth/register">Start Converting Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}