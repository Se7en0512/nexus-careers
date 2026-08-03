"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <button onClick={logout} disabled={busy} className="btn-secondary !py-[10px] !px-[18px] !text-[12.5px]">
      {busy ? "Signing out..." : "Log Out"}
    </button>
  );
}
