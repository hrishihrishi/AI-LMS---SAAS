import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const CTA = () => {
  return (
    <section className='cta-section'>
      <div className='cta-badge'>Start your learning journey</div>
      <h2 className='text-3xl font-bold'>Build and Personalize your learning companion</h2>
      <p>Pick a name, subject, voice and personality to get started. Start learning through voice and feel natural and fun.</p>
      <Image src="images/cta.svg" alt="cta-image" width={362} height={232}/>
      <button className='btn-primary'>
        <Image src="/icons/plus.svg" alt="plus-icon" width={12} height={12}/>
        <Link href="/companions/new">Build your new companion</Link>
      </button>
    </section>
  )
}

export default CTA