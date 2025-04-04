"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "./ui/Button"

export function LandingPage() {
  const [isClient, setIsClient] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-950 via-purple-900 to-blue-900">
   
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

      {/* Improved Header/Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-blue-950/80 backdrop-blur-md py-3 shadow-lg shadow-blue-900/30' : 'bg-transparent py-4 md:py-6'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-xl font-bold text-white md:text-2xl group">
                <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Convo</span>
                <div className="h-0.5 w-0 bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-300 group-hover:w-full"></div>
              </div>
              
          
              <nav className="ml-10 hidden md:block">
                <ul className="flex space-x-8">
                  <li>
                    <Link href="/dashboard" className="text-white/70 hover:text-white transition-colors duration-200">
                      Dashboard
                    </Link>
                  </li>
                  
                </ul>
              </nav>
            </div>
            
            <div className="flex gap-2 sm:flex-row sm:gap-4">
              <Button 
                asChild 
                variant="outline" 
                className="text-white border-white/20 hover:bg-white/10 hover:text-white hover:border-white/50 hover:scale-105 text-sm px-4 py-2 md:text-base md:px-6 md:py-2 transition-all duration-300"
              >
                <Link href="/auth/login" className="w-full text-center">
                  Login
                </Link>
              </Button>
              <Button 
                asChild 
                className="rounded-full bg-gradient-to-r from-green-600 to-emerald-700 px-4 py-2 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-green-500/20 hover:scale-105 text-sm md:text-base md:px-8 md:py-2 transition-all duration-300"
              >
                <Link href="/auth/register" className="w-full text-center">
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      

      <main className="container relative z-10 mx-auto px-4 py-12 pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight ">
            <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">Convert your</span>
            <br />
            <span className="bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">files easily</span>
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-blue-100/80">
            Convert your PDF files to XML while preserving document structure and formatting.
          </p>

          <div className="mx-auto mb-8 max-w-3xl">
            <div className="grid gap-8 md:grid-cols-3">
            
              <div className="group rounded-lg bg-white/5 p-6 backdrop-blur-sm border border-white/10 hover:border-green-400/40 transition-all duration-500 hover:bg-white/10 hover:shadow-lg hover:shadow-green-500/10 hover:-translate-y-1">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 group-hover:bg-green-500/30 transition-all duration-300 group-hover:scale-110">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-400 group-hover:text-green-300"
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
                <h3 className="mb-2 text-xl font-medium text-white group-hover:text-green-300 transition-colors">Upload PDF</h3>
                <p className="text-blue-100/70 group-hover:text-blue-100/90 transition-colors">Easily upload your PDF documents through our intuitive interface.</p>
              </div>

              
              <div className="group rounded-lg bg-white/5 p-6 backdrop-blur-sm border border-white/10 hover:border-blue-400/40 transition-all duration-500 hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 group-hover:bg-blue-500/30 transition-all duration-300 group-hover:scale-110">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-400 group-hover:text-blue-300"
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
                <h3 className="mb-2 text-xl font-medium text-white group-hover:text-blue-300 transition-colors">Convert</h3>
                <p className="text-blue-100/70 group-hover:text-blue-100/90 transition-colors">
                  Our system converts your PDF to XML while preserving structure and formatting.
                </p>
              </div>

       
              <div className="group rounded-lg bg-white/5 p-6 backdrop-blur-sm border border-white/10 hover:border-purple-400/40 transition-all duration-500 hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20 group-hover:bg-purple-500/30 transition-all duration-300 group-hover:scale-110">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-400 group-hover:text-purple-300"
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
                <h3 className="mb-2 text-xl font-medium text-white group-hover:text-purple-300 transition-colors">Download</h3>
                <p className="text-blue-100/70 group-hover:text-blue-100/90 transition-colors">
                  Download your converted XML files or view them directly in the browser.
                </p>
              </div>
            </div>

            <div className="mt-12">
              <Button 
                asChild 
                size="lg" 
                className="rounded-full bg-gradient-to-r from-green-600 to-emerald-700 px-8 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 hover:scale-105 transition-all duration-300"
              >
                <Link href="/auth/register">Start Converting Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}