import { LogoutButton } from "@/app/(protected)/_components/LogoutButton";
import { ExitIcon } from "@radix-ui/react-icons";

export default function Header() {
  return (
    <header className="bg-white/30 backdrop-blur-md shadow-md">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="font-bold w-full">
          Admin User
        </div>
        <LogoutButton className="w-auto flex items-center">
          <ExitIcon className="w-4 h-4 mr-2" />
          Logout
        </LogoutButton>
      </div>
    </header>
  );
}

