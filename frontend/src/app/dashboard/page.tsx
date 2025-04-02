
import { DashboardPage } from "@/components/dashboard"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | PDF to XML Converter",
  description: "Manage your PDF to XML conversions",
}

export default function Dashboard() {
  return <DashboardPage />
}

