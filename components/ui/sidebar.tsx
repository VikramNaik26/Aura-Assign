"use client"

import { Users, Building, LayoutDashboard, PieChart, BarChart } from 'lucide-react'
import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => pathname.startsWith(href)
  const isActiveParent = (href: string) => pathname === href

  return (
    <div className="flex flex-col w-64 bg-white h-full border-r">
      <div className="flex items-center my-2 gap-x-2">
        <Image
          src="/logo.svg"
          alt="logo"
          width={60}
          height={60}
        />
        <span className='font-semibold text-sm'>
          Aura Assign
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-4 space-y-2">
          <li>
            <Button
              variant={isActiveParent("/admin") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/admin">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </li>
          <li>
            <Button
              variant={isActive("/admin/users") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Users
              </Link>
            </Button>
          </li>
          <li>
            <Button
              variant={isActive("/admin/organizations") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/admin/organizations">
                <Building className="mr-2 h-4 w-4" />
                Organizations
              </Link>
            </Button>
          </li>
          <li>
            <Button
              variant={isActive("/admin/combined-analytics") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/admin/combined-analytics">
                <PieChart className="mr-2 h-4 w-4" />
                Combined Analytics
              </Link>
            </Button>
          </li>
          <li>
            <Button
              variant={isActive("/admin/event-analytics") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/admin/event-analytics">
                <BarChart className="mr-2 h-4 w-4" />
                Event Analytics
              </Link>
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  )
}
