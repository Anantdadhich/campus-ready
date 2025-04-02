"use client";


import { Registerform } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-blue-950 via-purple-900 to-blue-900 flex items-center justify-center lg:grid lg:grid-cols-3 lg:px-0">
      

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

      <div className="hidden lg:block"></div>

 
      <div className="relative lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] backdrop-blur-md bg-white/10 p-8 rounded-xl border border-white/10 shadow-xl">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-white">Create an account</h1>
            <p className="text-sm text-blue-100/80">Enter your details to create a new account</p>
          </div>
          <Registerform></Registerform> 
          <p className="px-8 text-center text-sm text-blue-100/70">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline underline-offset-4 hover:text-white">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-4 hover:text-white">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>

      {/* For desktop: empty right column */}
      <div className="hidden lg:block"></div>
    </div>
  );
}
