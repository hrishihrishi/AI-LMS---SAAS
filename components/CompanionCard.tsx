'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { Button } from './ui/button';
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import { addBookmark, removeBookmark, getBookmarkedCompanions } from '@/lib/actions/companion.actions';
import { getSubjectColor } from '@/lib/utils';

interface CompanionCardsProps {
    id: string;
    name: string;
    topic: string;
    subject: string;
    duration: number;
    bookmarked: boolean;
}

/**
 * CompanionCard Component
 * Displays summary details of a single learning companion (topic, companion name, duration, and subject).
 * Contains logic to toggle bookmarks (add/remove bookmark) and a link to launch the session.
 */
const CompanionCard = ({
    id,
    name,
    topic,
    subject,
    duration,
    bookmarked
}: CompanionCardsProps) => {
    return (
        // Dynamic background color is determined by the subject type
        <article className='companion-card' style={{backgroundColor: getSubjectColor(subject)}}>
            <div className='flex justify-between items-center'>
                {/* Subject badge tag */}
                <div className='subject-badge'>{subject}</div>
                
                {/* Bookmark action button */}
                <button className='companion-bookmark'
                    onClick={async () => {
                        if (bookmarked) {
                            await removeBookmark(id, '/');
                        } else {
                            await addBookmark(id, '/');
                        }
                    }}
                >
                    {bookmarked ? (
                        <Image src='./icons/bookmark-filled.svg' alt='bookmark' width={12.5} height={15} />
                    ) : (
                        <Image src='./icons/bookmark.svg' alt='bookmark' width={12.5} height={15} />
                    )}
                </button>
            </div>
            
            {/* Card Content info */}
            <h2 className='text-2xl font-bold text-black'>{topic}</h2>
            <p className='text-md text-black'>-by {name}</p>
            <div className='flex items-center gap-2 text-black'>
                <Image src='./icons/clock.svg' alt='clock' width={15} height={15} />
                <p>{duration} min</p>
            </div>
            
            {/* Launch button to open the detailed companion view */}
            <Link href={`./companions/${id}`}>
                <Button className='w-full btn-primary justify-center'>Launch lesson</Button>
            </Link>
        </article>
    )
}

export default CompanionCard;