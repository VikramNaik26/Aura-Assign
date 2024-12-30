import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users, Building, LayoutDashboard, PieChart, BarChart } from 'lucide-react'

export function Sidebar() {
  return (
    <div className="flex flex-col w-64 bg-white h-full border-r">
      <div className="flex items-center justify-center h-16 border-b">
        <span className="text-lg font-bold">Admin Panel</span>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-4 space-y-2">
          <li>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/admin">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Users
              </Link>
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/admin/organizations">
                <Building className="mr-2 h-4 w-4" />
                Organizations
              </Link>
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/admin/user-analytics">
                <PieChart className="mr-2 h-4 w-4" />
                User Analytics
              </Link>
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start" asChild>
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


