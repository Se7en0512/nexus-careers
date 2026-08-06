"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const logout = async () => {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <Button variant="secondary" loading={busy} onClick={logout} className="!py-[10px] !px-[18px] !text-[12.5px]">
      {busy ? "Signing out..." : "Log Out"}
    </Button>
  );
}
