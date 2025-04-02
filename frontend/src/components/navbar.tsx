"use client"

import { useRouter } from "next/navigation"

export const Navbar=()=>{
   const router=useRouter()
    return (
         <nav className="flex justify-between items-center py-4 ">
                    <div className="flex items-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                        <rect x="4" y="4" width="6" height="6" rx="1" fill="white" />
                        <rect x="14" y="4" width="6" height="6" rx="1" fill="white" />
                        <rect x="4" y="14" width="6" height="6" rx="1" fill="white" />
                        <rect x="14" y="14" width="6" height="6" rx="1" fill="white" />
                      </svg>
                      <span className="text-white font-bold text-xl">Convo.xml</span>
                    </div>
                    
                    
                    
                    <button onClick={()=>router.push("/auth/register")}  className="bg-gray-500 bg-opacity-60 hover:bg-opacity-80 text-white px-6 py-2 rounded-full transition-all duration-200 backdrop-blur-sm">
                      Sign in
                    </button>
                  </nav>
    )
}