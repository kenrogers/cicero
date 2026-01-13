"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MeetingDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Meeting detail error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Card className="border-destructive/50">
          <CardContent className="p-12 text-center">
            <AlertCircle className="size-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Couldn&apos;t load meeting</h1>
            <p className="text-muted-foreground mb-6">
              There was a problem loading this meeting summary. It may have been removed or there&apos;s a temporary issue.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={reset} variant="default">
                <RefreshCw className="size-4 mr-2" />
                Try Again
              </Button>
              <Button variant="outline" asChild>
                <Link href="/meetings">
                  <ArrowLeft className="size-4 mr-2" />
                  All Meetings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
