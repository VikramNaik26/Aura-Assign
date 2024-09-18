"use client"

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { Suspense } from "react"

import { DashboardSidebar } from "./_components/DashboardSidebar"
import { BottomNavbar } from "./_components/BottomNavbar"

const queryClient = new QueryClient()

interface ProtectedLayoutProps {
  children: React.ReactNode
}

const ProtectedLayout = ({
  children
}: ProtectedLayoutProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <main>
        <section className="h-[100dvh] w-full px-4">
          <div className="flex gap-x-3 h-full">
            <Suspense fallback={<div>Loading...</div>}>
              <DashboardSidebar />
              <BottomNavbar />
            </Suspense>
            <div className="h-full flex-1 w-full">
              {children}
            </div>
          </div>
        </section>
      </main>
    </QueryClientProvider>
  )
}

export default ProtectedLayout

