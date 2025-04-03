
import { DashboardPage } from "@/components/dashboard"
import { ProtectedRoute } from "@/components/protectedroute"



export default function Dashboard() {
  return (
   <ProtectedRoute>
     <DashboardPage />
   </ProtectedRoute>
  )
  

}

