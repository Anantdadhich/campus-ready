import { Navbar } from "@/components/navbar";
import { Uploadfile } from "@/components/upload";

export default function Home() {
  return (
    <>
      <main 
        className="h-screen overflow-hidden" 
        style={{ 
          background: 'linear-gradient(135deg, #0F1729 0%, #1E293B 100%)', 
          position: 'relative'
        }}
      >
  
        <div className="absolute top-1/4 right-1/4 w-16 h-16 rounded-full bg-white opacity-20"></div>
        <div className="absolute top-1/4 right-1/5 w-2 h-2 rounded-full bg-red-400"></div>
        <div className="absolute bottom-1/3 left-1/6 w-6 h-6 rounded-full bg-green-500"></div>

       
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Navbar />
        </div>

 
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16 pb-24">
          <h1 className="text-6xl md:text-7xl font-bold mb-8">
            <span className="text-green-400 block md:inline">Convert your</span>
            <span className="text-white block md:inline"> file easily</span>
          </h1>
          
          <p className="text-gray-300 mb-16 max-w-2xl mx-auto">
            Convert your pdf files into the xml files easily.
          </p>

          <Uploadfile />
        </div>

     
        <div className="absolute bottom-1/4 right-1/3 w-24 h-24">
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 0C50 27.6142 27.6142 50 0 50C27.6142 50 50 72.3858 50 100C50 72.3858 72.3858 50 100 50C72.3858 50 50 27.6142 50 0Z" stroke="white" strokeWidth="1" strokeOpacity="0.2"/>
          </svg>
        </div>
      </main>
    </>
  );
}