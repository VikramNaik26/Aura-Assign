"use client"

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { Suspense } from "react"

import { DashboardSidebar } from "./_components/DashboardSidebar"

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
        <section className="h-full px-4">
          <div className="flex gap-x-3 h-full">
            <Suspense fallback={<div>Loading...</div>}>
              <DashboardSidebar />
            </Suspense>
            <div className="h-full flex-1">
              {children}
            </div>
          </div>
        </section>
      </main>
    </QueryClientProvider>
  )
}

export default ProtectedLayout

