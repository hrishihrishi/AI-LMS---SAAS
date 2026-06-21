import CompanionCard from '@/components/CompanionCard'
import CompanionList from '@/components/CompanionsList'
import CTA from '@/components/CTA'
import Cta from '@/components/CTA'
import { Button } from '@/components/ui/button'
import { recentSessions } from '@/constants'
import { getAllCompanions, getRecentSessions, getUserSessions } from '@/lib/actions/companion.actions'
import React from 'react'

export const dynamic = 'force-dynamic'

const Page = async () => {
  const companions = await getAllCompanions({limit: 3})
  const recentSessionsCompanions = await getRecentSessions(10)
  console.log('recent sessions:',recentSessionsCompanions)

  return (
    <main>
      <CTA/>
      <h1>Popular Companions</h1>
      <section className='home-section'>
        {companions.map((companion) => (
          <CompanionCard 
          key={companion.id}
          {...companion}
          />
        ))}
        
      </section>
      <section className='home-section'>
        <CompanionList
          title='Recently updated sessions'
          companions={recentSessionsCompanions}
          classNames='w-2/3 max-lg:w-full'
        />
      </section>
    </main>
  )
}

export default Page