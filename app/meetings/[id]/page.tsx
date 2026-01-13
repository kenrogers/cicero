import { Metadata } from "next";
import MeetingDetail from "./MeetingDetail";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Meeting Summary | Cicero`,
    description: `AI-powered summary of Fort Collins City Council meeting.`,
  };
}

export default async function MeetingPage({ params }: Props) {
  const { id } = await params;
  
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <MeetingDetail meetingId={id} />
      </div>
    </div>
  );
}
