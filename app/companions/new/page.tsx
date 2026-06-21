import CompanionForm from '@/components/CompanionForm'
import React from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';

const NewCompanion = async() => {

  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  return (
    <main className='min-lg:1/3 min-md:2/3 items-center justify-center mb-20'>
      <article>
        <h1 className='pb-10'>Companion Builder</h1>
        <CompanionForm />
      </article>
    </main>
  )
}

export default NewCompanion