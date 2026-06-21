import { getCompanion } from "@/lib/actions/companion.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSubjectColor } from "@/lib/utils";
import Image from "next/image";
import { deleteCompanion } from "@/lib/actions/companion.actions";
import CompanionComponent from "@/components/CompanionComponent";
import DeleteCompanionButton from "@/components/ui/DeleteCompanionButton";

interface CompanionSessionPageProps {
  params: Promise<{ id: string }>;
}

/**
 * CompanionSession Page (Server Component)
 * Dynamically resolves the specific companion detail workspace page based on dynamic segment `[id]`.
 * Fetches current clerk user credentials, query metadata, and mounts the call interface.
 */
const CompanionSession = async ({ params }: CompanionSessionPageProps) => {
  // Resolve dynamic segment parameter
  const { id } = await params;
  const companion = await getCompanion(id);
  const user = await currentUser();

  const { name, subject, title, topic, duration } = companion;

  // Enforce session access control
  if (!user) redirect("/sign-in");
  if (!name) redirect("/companions");

  return (
    <main>
      {/* Session Header Card detailing Subject, Topic, and Duration */}
      <article className="flex rounded-border justify-between p-6 max-md:flex-col">
        <div className="flex items-center gap-2">
          {/* Coding icon container */}
          <div
            className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden"
            style={{ backgroundColor: "pink" }}
          >
            <Image
              src={`/icons/coding.svg`}
              alt={subject}
              width={35}
              height={35}
            />
          </div>

          {/* Details header titles */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <p className="font-bold text-2xl">{name}</p>
              <div className="subject-badge max-sm:hidden">{subject}</div>
            </div>
            <p className="text-lg">{topic}</p>
          </div>
        </div>
        
        {/* Right action options */}
        <div className="flex flex-col gap-2 p-1">
          <div className="items-start text-2xl max-md:hidden">
            {duration} minutes
          </div>
          {/* Render the interactive Client Component for deletion handling */}
          <DeleteCompanionButton id={id} />
        </div>
      </article>

      {/* Renders the interactive Voice Session audio component */}
      <CompanionComponent
        {...companion}
        companionId={id}
        userName={user.firstName!}
        userImage={user.imageUrl!}
      />
    </main>
  );
};

export default CompanionSession;
