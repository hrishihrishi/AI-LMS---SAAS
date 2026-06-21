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

const CompanionCard = ({
    id,
    name,
    topic,
    subject,
    duration,
    bookmarked
}: CompanionCardsProps) => {
    return (
        // style={{backgroundColor: getSubjectColor(subject)}
        <article className='companion-card' style={{backgroundColor: getSubjectColor(subject)}}>
            <div className='flex justify-between items-center'>
                <div className='subject-badge'>{subject}</div>
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
            <h2 className='text-2xl font-bold'>{name}</h2>
            <p className='text-sm'>{topic}</p>
            <div className='flex items-center gap-2'>
                <Image src='./icons/clock.svg' alt='clock' width={15} height={15} />
                <p>{duration} min</p>
            </div>
            <Link href={`./companions/${id}`}>
                <Button className='w-full btn-primary justify-center'>Launch lesson</Button>
            </Link>
        </article>
    )
}

export default CompanionCard