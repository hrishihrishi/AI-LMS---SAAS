import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import NavItems from './NavItems'

const Navbar = () => {
    return (
        <nav className='navbar'>
            <Link href="/">
                <div className='flex items-center cursor-pointer gap-2.5'>
                    <Image src='/images/logo.svg' width={46} height={44} alt='logo' />
                </div>
            </Link>
            <div className='flex items-center gap-8'>
                <NavItems/>
                <p>Signin</p>
            </div>
        </nav>
    )
}

export default Navbar