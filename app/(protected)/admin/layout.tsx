import { Sidebar } from '@/components/ui/sidebar'
import Header from '@/components/ui/header'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 scrollbar-hide overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}


