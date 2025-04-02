
import { DashboardPage } from "@/components/dashboard"
import { ProtectedRoute } from "@/components/protectedroute"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | PDF to XML Converter",
  description: "Manage your PDF to XML conversions",
}

export default function Dashboard() {
  return (
   <ProtectedRoute>
     <DashboardPage />
   </ProtectedRoute>
  )
  

}

