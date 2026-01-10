import CompanionCard from '@/components/CompanionCard'
import CompanionList from '@/components/CompanionsList'
import CTA from '@/components/CTA'
import Cta from '@/components/CTA'
import { Button } from '@/components/ui/button'
import { recentSessions } from '@/constants'
import React from 'react'


const Page = () => {
  return (
    <main>
      <h1>Popular Companions</h1>
      <section className='home-section'>
        <CompanionCard
          id='123'
          name='Neura the Brainy Explorer'
          topic='Neural network of the brain'
          subject='science'
          duration={45}
          color='#a6dada'
        />
        <CompanionCard
          id='456'
          name='Neura the Brainy Explorer'
          topic='Neural network of the brain'
          subject='science'
          duration={45}
          color='#e6dada'
        />
        <CompanionCard
          id='789'
          name='Neura the Brainy Explorer'
          topic='Neural network of the brain'
          subject='science'
          duration={45}
          color='#ffda6e'
        />
        
      </section>
      <section className='home-section'>
        <CompanionList
          title='Recently updated sessions'
          companions={recentSessions}
          classNames='w-2/3 max-lg:w-full'
        />
        <CTA/>
      </section>
    </main>
  )
}

export default Page