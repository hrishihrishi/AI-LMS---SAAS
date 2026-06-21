import React from "react";
import Link from "next/link";
import Image from "next/image";
import NavItems from "./NavItems";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import ThemeToggle from "./ThemeToggle";

/**
 * Navbar Component
 * The main header navigation bar of the application.
 * Contains the logo, navigation links, theme toggle button, and authentication action buttons (Clerk Sign In / User Profile).
 */
const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Clickable Brand Logo linking to homepage */}
      <Link href="/">
        <div className="flex items-center cursor-pointer gap-2.5">
          <Image src="/images/logo.svg" width={46} height={44} alt="logo" />
        </div>
      </Link>

      {/* Navigation links, theme toggler, and auth states */}
      <div className="flex items-center gap-8">
        <NavItems />
        <button className="bg-yellow-500 text-black p-2 rounded-full hover:bg-yellow-600 transition-colors">
          <Link href="/companions/new" >
            <Image src="/icons/plus.svg" alt="plus-icon" width={20} height={20} />
          </Link>
        </button>
        <ThemeToggle />

        {/* Displayed when user is NOT authenticated */}
        <SignedOut>
          <div className="flex items-center gap-2">
            <SignInButton>
              <button className="btn-signin">Sign In</button>
            </SignInButton>
          </div>
        </SignedOut>

        {/* Displayed when user IS authenticated */}
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;
