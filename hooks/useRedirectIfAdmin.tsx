import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentOrgORUser } from "./useCurrentOrgORUser";
import { UserRole } from "@prisma/client"

export default function useRedirectIfAdmin() {
    const router = useRouter();
    const { data: organizationOrUser, status } = useCurrentOrgORUser();

    useEffect(() => {
        if (status === "authenticated" && organizationOrUser?.role === UserRole.ADMIN) {
            router.push("/admin");
        }
    }, [status, organizationOrUser, router]);

    return { organizationOrUser, status };
};
