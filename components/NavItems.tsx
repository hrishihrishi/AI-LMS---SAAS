"use client"

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

// Define navigation items with their respective paths
const navItems = [
    {label: 'Home', href: '/'},
    {label: 'Companions', href:'/companions'},
    {label: 'My Journey', href:'/my-journey'}
]

/**
 * NavItems Component
 * Renders the main navigation links inside the Header/Navbar.
 * Highlights the active link matching the current route path.
 */
const NavItems = () => {
    // Hook to detect the current page pathname
    const pathName = usePathname();

    return (
        <nav className='flex items-center gap-4'>
            {navItems.map( ({label, href})=>(
                <Link href={href} key={label} className={cn(pathName===href && 'text-primary font-semibold')}>
                    {label}
                </Link>
            ))}
        </nav>
    )
}

export default NavItems;