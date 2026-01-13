import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileQuestion, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MeetingNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Card>
          <CardContent className="p-12 text-center">
            <FileQuestion className="size-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Meeting Not Found</h1>
            <p className="text-muted-foreground mb-6">
              This meeting doesn&apos;t exist or may have been removed.
            </p>
            <Button asChild>
              <Link href="/meetings">
                <ArrowLeft className="size-4 mr-2" />
                Browse All Meetings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
