import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";

export default async function Nav() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-50 bg-navy-950/90 backdrop-blur border-b border-navy-700">
      <div className="max-w-[1180px] mx-auto px-8 h-16 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid place-items-center w-[34px] h-[34px] rounded-[10px] bg-navy-800 border border-gold-400/30 transition-transform duration-300 group-hover:rotate-90">
            <Logo size={22} />
          </span>
          <span className="font-serif text-[21px] font-medium tracking-[-0.02em]">
            Nexus<span className="text-gold-400"> Careers</span>
          </span>
        </Link>

        <nav className="hidden lg:flex">
          <NavLinks className="flex items-center gap-7" />
        </nav>

<div className="hidden lg:flex items-center gap-5">
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
