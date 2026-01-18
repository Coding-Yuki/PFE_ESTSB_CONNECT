import type React from "react"
import { AuthProvider } from "@/lib/auth-context"
import { DataProvider } from "@/lib/data-context"
import { Navbar } from "@/components/navbar"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="min-h-screen bg-background">
          <Navbar />
          {children}
        </div>
      </DataProvider>
    </AuthProvider>
  )
}
