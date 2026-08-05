import Link from "next/link";
import { getSessionUser, isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";

export default async function Nav() {
  const user = await getSessionUser();
  const admin = user ? isAdmin(user) : false;

  let unreadCount = 0;
  if (admin) {
    try {
      const row = (await db.prepare("SELECT COUNT(*) AS n FROM notifications WHERE read = 0").get()) as { n: number } | null;
      unreadCount = row?.n ?? 0;
    } catch {
      // non-critical
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-navy-950/90 backdrop-blur border-b border-navy-700">
      <div className="max-w-[1180px] mx-auto px-8 h-16 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid place-items-center w-[34px] h-[34px] rounded-[10px] bg-navy-800 border border-gold-400/30 transition-transform duration-300 group-hover:rotate-90">
            <Logo size={22} />
          </span>
          <span className="font-serif text-[21px] font-medium tracking-[-0.02em]">
            Thrive
          </span>
        </Link>

        <nav className="hidden lg:flex">
          <NavLinks className="flex items-center gap-7" />
        </nav>

<div className="hidden lg:flex items-center gap-5">
              {admin && (
                <Link href="/admin" className="relative nav-link">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-gold-400 text-navy-950 rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>
              )}
              {user ? (
                <Link href="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="nav-link">
                    Sign In
                  </Link>
                  <Link href="/signup" className="btn-primary !py-[9px] !px-[16px] !text-[12px]">
                    Create Account
                  </Link>
                </>
              )}
            </div>

        <div className="lg:hidden">
          <MobileMenu loggedIn={!!user} />
        </div>
      </div>
    </header>
  );
}
