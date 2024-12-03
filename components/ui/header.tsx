import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Search } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center">
          <Input
            type="search"
            placeholder="Search..."
            className="w-64 mr-4"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
        <div className="flex items-center">
          <Button variant="outline" size="icon" className="mr-2">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          <span className="text-sm font-medium">Admin User</span>
        </div>
      </div>
    </header>
  )
}
