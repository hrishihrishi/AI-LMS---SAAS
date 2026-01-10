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
interface CompanionListProps {
  title: string;
  companions?: Companion[];
  classNames?: string;
}
import React from 'react'

const CompanionList = ({ title, companions, classNames }: CompanionListProps) => {
  return (
    <article>
      <h2 className="font-bold text-3xl">{title}</h2>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="text-lg w-2/3">Lessons</TableHead>
            <TableHead className="text-lg">Subject</TableHead>
            <TableHead className="text-lg text-right">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companions?.map(({ id, subject, name, duration, color }) => (
            <TableRow key={id}>
              <TableCell>
                <Link href={`/companion/${id}`}>
                  <div className="flex items-center gap-2">
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
              <TableCell>
                <div className="subject-badge w-fit max-md:hidden">
                  {subject}
                </div>
                <div className="flex items-center justify-center rounded-lg w-fit p-2 min-lg:hidden" style={{backgroundColor: getSubjectColor(subject)}}>
                  <Image src={`/icons/${subject}.svg`} alt="subject-icon" width={18} height={18}/>
                </div>
              </TableCell>
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

export default CompanionList