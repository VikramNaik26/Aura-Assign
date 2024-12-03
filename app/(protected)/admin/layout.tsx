import Header from '@/components/ui/header'
import { Sidebar } from '@/components/ui/sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 scrollbar-hide">
          {children}
        </main>
      </div>
    </div>
  )
}
