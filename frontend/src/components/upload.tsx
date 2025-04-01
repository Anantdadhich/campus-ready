"use client"
import React, { useState, useRef, DragEvent } from 'react';



export const Uploadfile=()=>{
    const [uploadedFiles, setUploadedFiles] = useState<{ name: string; status: string; progress?: number }[]>();
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    const handleDrag = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
    };
  
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
    };
  
    const openFileDialog = () => {
      fileInputRef.current?.click();
    };

    return (
        <div className="max-w-4xl mx-auto bg-gray-900 rounded-xl p-6">
            <div 
              className="border-2 border-dashed border-gray-600 rounded-lg p-16"
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
                  <path d="M24 12V36M24 12L16 20M24 12L32 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                
                <p className="text-white text-lg mb-1">Drag&Drop file here</p>
                <p className="text-gray-500 mb-4">or</p>
                
                <input 
                  ref={fileInputRef}
                  type="file" 
                  className="hidden" 
                />
                
                <button 
                  onClick={openFileDialog}
                  className="bg-gray-800 text-white flex items-center px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                    <path d="M5.83333 14.1667L14.1667 5.83333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.83333 5.83333H14.1667V14.1667" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Choose file
                </button>
                
                <p className="text-gray-500 text-sm mt-4">Maximum upload size 10 MB</p>
              </div>
            </div>

          
            
          </div>
    )
  
}