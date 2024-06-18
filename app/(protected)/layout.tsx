interface ProtectedLayoutProps {
  children: React.ReactNode
}

const ProtectedLayout = ({
  children
}: ProtectedLayoutProps) => {
  return (
    <main>
      {children}
    </main>
  )
}

export default ProtectedLayout

