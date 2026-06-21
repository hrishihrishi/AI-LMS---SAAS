import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getSubjectColor } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from 'react'

interface CompanionListProps {
  title: string;
  companions?: Companion[];
  classNames?: string;
}

/**
 * CompanionList Component
 * Renders a list of learning companions in a tabular layout.
 * Shows details like lesson subject, avatar, title, and session duration.
 */
const CompanionList = ({ title, companions, classNames }: CompanionListProps) => {
  return (
    <article>
      <h2 className="font-bold text-3xl">{title}</h2>
      <Table>

        {/* Table header */}
        <TableHeader>
          <TableRow>
            <TableHead className="text-lg w-2/3">Lessons</TableHead>
            <TableHead className="text-lg">Subject</TableHead>
            <TableHead className="text-lg text-right">Duration</TableHead>
          </TableRow>
        </TableHeader>

        {/* Dynamic rows for each companion in the list */}
        <TableBody>
          {companions?.map(({ id, subject, name, duration, color }) => (
            <TableRow key={id}>

              {/* Lesson Info (icon, name, subject details) linking to detail page */}
              <TableCell>
                <Link href={`/companion/${id}`}>
                  <div className="flex items-center gap-2">
                    {/* Subject avatar container (hidden on tablet/mobile screens) */}
                    <div className="size-[58px] flex items-center justify-center rounded-lg max-md:hidden m-4" style={{backgroundColor: getSubjectColor(subject)}} >
                      <Image src={`/icons/${subject}.svg`} alt="subject-icon" width={30} height={30}/>
                    </div>
                    <div>
                      <p className="font-bold text-2xl">{name}</p>
                      <p className="text-lg">{subject}</p>
                    </div>
                  </div>
                </Link>
              </TableCell>

              {/* Subject Tag (responsive badge vs small icon badge) */}
              <TableCell>
                {/* Text badge visible on larger screens */}
                <div className="subject-badge w-fit max-md:hidden">
                  {subject}
                </div>
                {/* Icon badge shown on smaller/mobile devices */}
                <div className="flex items-center justify-center rounded-lg w-fit p-2 min-lg:hidden" style={{backgroundColor: getSubjectColor(subject)}}>
                  <Image src={`/icons/${subject}.svg`} alt="subject-icon" width={18} height={18}/>
                </div>
              </TableCell>

              {/* Lesson Duration with clock icon */}
              <TableCell>
                <div className="flex items-center gap-2 w-full justify-end">
                  <p>{duration} min</p>
                  <Image src="/icons/clock.svg" alt="clock-icon" width={18} height={18}/>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </article>
  )
}

export default CompanionList;