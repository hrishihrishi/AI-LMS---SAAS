import CompanionCard from '@/components/CompanionCard'
import CompanionList from '@/components/CompanionsList'
import CTA from '@/components/CTA'
import Cta from '@/components/CTA'
import { Button } from '@/components/ui/button'
import { recentSessions } from '@/constants'
import { getAllCompanions, getRecentSessions, getUserSessions } from '@/lib/actions/companion.actions'
import React from 'react'

// Force dynamic execution to ensure fresh data queries on every request
export const dynamic = 'force-dynamic'

/**
 * Dashboard/Home Page (Server Component)
 * Fetches popular companions and recently accessed sessions.
 * Renders the Call-to-Action panel, companion cards, and the dynamic sessions list table.
 */
const Page = async () => {
  // Query 3 popular companions and up to 10 recently accessed sessions
  const companions = await getAllCompanions({limit: 3})
  const recentSessionsCompanions = await getRecentSessions(10)
  console.log('recent sessions:',recentSessionsCompanions)

  return (
    <main>
      {/* Call to Action card to prompt building new companions */}
      <CTA/>
      
      {/* Popular Companions grid display list */}
      <h1>Popular Companions</h1>
      <section className='home-section'>
        {companions.map((companion) => (
          <CompanionCard 
            key={companion.id}
            {...companion}
          />
        ))}
      </section>
      
      {/* Recent Sessions list table display */}
      <section className='home-section'>
        <CompanionList
          title='Recently accessed sessions'
          companions={recentSessionsCompanions}
          classNames='w-2/3 max-lg:w-full'
        />
      </section>
    </main>
  )
}

export default Page;