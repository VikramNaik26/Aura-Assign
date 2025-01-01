"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Home, Calendar, Users, Settings, LineChart } from 'lucide-react'
import { UserRole } from "@prisma/client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RoleGate } from "@/components/auth/RoleGate"
import { useCurrentRole } from '@/hooks/useCurrentRole'
import { EventDialog } from './EventDialog'

interface SidebarProps {
  organizationOrUser: {
    role: UserRole
  }
}

export function Sidebar({ organizationOrUser }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => setIsOpen(!isOpen)
  const { role, status } = useCurrentRole()

  const [isDialogOpen, setDialogOpen] = useState<boolean>(false)
  const closeDialog = () => setDialogOpen(false)

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: Calendar, label: "Events", href: "/events" },
    { icon: Users, label: "Users", href: "/users" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: LineChart, label: "Analytics", href: "/analytics" },
  ]

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-6 left-4 z-50 lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-background shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-semibold">Menu</h2>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
            <X className="h-6 w-6" />
            <span className="sr-only">Close Sidebar</span>
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-5rem)] pb-10">
          <nav className="space-y-2 p-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="px-4">
            <RoleGate role={role} allowedRole={UserRole.ORGANIZATION}>
              <div className="space-y-1 w-full">
                <EventDialog isDialogOpen={isDialogOpen} setDialogOpen={setDialogOpen} closeDialog={closeDialog} />
              </div>
            </RoleGate>
          </div>
        </ScrollArea>
      </div>
    </>
  )
}
