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

  return (
    <main>
      <h1>Popular Companions</h1>
      <section className='home-section'>
        {companions.map((companion) => (
          <CompanionCard 
          key={companion.id}
          {...companion}
          />
        ))}
        {/* <CompanionCard
          id='123'
          name='Neura the Brainy Explorer'
          topic='Neural network of the brain'
          subject='science'
          duration={45}
          color='#a6dada'
        /> */}
        
        
      </section>
      <section className='home-section'>
        <CompanionList
          title='Recently updated sessions'
          companions={recentSessionsCompanions}
          classNames='w-2/3 max-lg:w-full'
        />
        <CTA/>
      </section>
    </main>
  )
}

export default Page