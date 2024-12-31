import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentOrgORUser } from "./useCurrentOrgORUser";
import { UserRole } from "@prisma/client";

export default function useRedirectIfAdmin() {
  const router = useRouter();
  const { data: organizationOrUser, status } = useCurrentOrgORUser();

  useEffect(() => {
    // Only attempt redirect if we have a definitive status and user data
    console.log({status, organizationOrUser})
    if (status === "authenticated" &&
      organizationOrUser &&
      organizationOrUser.role === UserRole.ADMIN) {
      // Force immediate navigation
      router.replace("/admin");
      // As a backup, also try push
      setTimeout(() => {
        if (window.location.pathname !== "/admin") {
          window.location.href = "/admin";
        }
      }, 100);
    }
  }, [status, organizationOrUser, router]);

  return { organizationOrUser, status };
}
