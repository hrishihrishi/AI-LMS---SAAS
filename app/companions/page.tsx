import CompanionCard from '@/components/CompanionCard';
import SearchInput from '@/components/SearchInput';
import SubjectFilter from '@/components/SubjectFilter';
import { getAllCompanions } from '@/lib/actions/companion.actions';
import React from 'react'

/**
 * CompanionsLibrary Page (Server Component)
 * Displays the entire collection of AI companions.
 * Supports interactive client filtering via search inputs and subject filters in searchParams.
 */
const CompanionsLibrary = async({searchParams}: SearchParams) => {
  // Resolve URL search parameters filters
  const filters = await searchParams;
  const subject = filters.subject ? filters.subject : "";
  const topic = filters.topic ? filters.topic : "";

  // Query filtered companion profiles list from Supabase
  const companions = await getAllCompanions({subject, topic});

  return (
    <main>
      {/* Filtering header section */}
      <section className='flex justify-between gap-4 max-sm:flex-col'>
        <h1>Companions</h1>
        <SearchInput/>
        <SubjectFilter/>
      </section>
      
      {/* Grid of companions listing responsive layout */}
      <section className='grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-5'>
        {companions.map((companion)=>(
          <CompanionCard key={companion._id} {...companion}/>
        ))}
      </section>
    </main>
  )
}

export default CompanionsLibrary