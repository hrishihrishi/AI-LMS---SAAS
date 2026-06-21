import CompanionForm from '@/components/CompanionForm'
import React from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';

/**
 * NewCompanion Page (Server Component)
 * Provides the interface form page for authenticated users to create a new companion profile.
 */
const NewCompanion = async() => {
  // Validate clerk authentication credentials
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  return (
    <main className='min-lg:1/3 min-md:2/3 items-center justify-center mb-20'>
      <article>
        {/* Title Header */}
        <h1 className='pb-10'>Companion Builder</h1>
        
        {/* Mount interactive Companion Builder Form client component */}
        <CompanionForm />
      </article>
    </main>
  )
}

export default NewCompanion;