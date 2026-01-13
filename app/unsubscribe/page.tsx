"use client";

import { useSearchParams } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [status, setStatus] = useState<"loading" | "success" | "error" | "no-email">("loading");
  const [message, setMessage] = useState("");

  const unsubscribe = useMutation(api.subscribers.unsubscribe);

  useEffect(() => {
    if (!email) {
      setStatus("no-email");
      return;
    }

    const doUnsubscribe = async () => {
      try {
        const result = await unsubscribe({ email });
        if (result.success) {
          setStatus("success");
          setMessage(result.message);
        } else {
          setStatus("error");
          setMessage(result.message);
        }
      } catch {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    doUnsubscribe();
  }, [email, unsubscribe]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="size-12 animate-spin text-muted-foreground" />
            <p className="text-lg">Unsubscribing...</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle2 className="size-12 text-green-500" />
            <h1 className="text-2xl font-semibold">Unsubscribed</h1>
            <p className="text-muted-foreground">{message}</p>
            <p className="text-sm text-muted-foreground mt-4">
              You won&apos;t receive any more emails from Cicero.
            </p>
            <Button asChild className="mt-4">
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <XCircle className="size-12 text-red-500" />
            <h1 className="text-2xl font-semibold">Oops</h1>
            <p className="text-muted-foreground">{message}</p>
            <Button asChild className="mt-4">
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        )}

        {status === "no-email" && (
          <div className="flex flex-col items-center gap-4">
            <XCircle className="size-12 text-yellow-500" />
            <h1 className="text-2xl font-semibold">Missing Email</h1>
            <p className="text-muted-foreground">
              No email address provided. Please use the unsubscribe link from your email.
            </p>
            <Button asChild className="mt-4">
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="size-12 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
