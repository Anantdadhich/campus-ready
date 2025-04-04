"use client"

import { useRouter } from "next/navigation"
import z from "zod"
import {useToast} from "./ui/toastui"
import { useState } from "react"
import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import axios from "axios"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form"
import Link from "next/link"
import { Input } from "./ui/input"
import { Button } from "./ui/Button"

const formSchema=z.object({
    name:z.string().min(2,{
        message:"Name must be min 2"
    }),
    email:z.string().email({message:"please enter a valid email"}),
    password:z.string().min(8,{message:"password must be 8 letter"}),
    confirmpassword:z.string()
}).refine((data)=>data.password=== data.confirmpassword,{
      message:"password not match",
      path:["confirmpassword"]
}  )

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";


export const Registerform = () => {
   const router=useRouter();
   const {toast}=useToast()

   const [isLoading,setIsLoading]=useState(false)
   const form=useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues:{
        name:"",
        email:"",
        password:"",
        confirmpassword:""
    }
   })

   async function submithandel(values:z.infer<typeof formSchema>) {
      setIsLoading(true)
      try {
        await new Promise((resolve)=>setTimeout(resolve,1000)) 


        const response=await axios.post(`${API_URL}/api/auth/register`,values)

        if(response.status===200){
            toast({
                title:"Register succesdfull",
                description:"Yes you can log in ",
                variant:"default"
            });

            router.push("/auth/login");
            form.reset()

        }
      } catch (error) {
        toast({
            title: "Registration Failed",
            description: "Something went wrong. Try again.",
             
          });
      }finally{
        setIsLoading(false)
    }


   }

  return (
    <div className="grid gap-6">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submithandel)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmpassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Register"}
        </Button>
      </form>
    </Form>
    <div className="text-center text-sm">
      Already have an account?{" "}
      <Link href="/auth/login" className="underline">
        Login
      </Link>
    </div>
  </div>
  )
}

