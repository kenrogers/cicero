import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SubscribeForm } from "./SubscribeForm";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero - full height centered */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24">
        <div className="text-center max-w-2xl mx-auto">
          {/* Wordmark */}
          <h1 className="wordmark text-5xl md:text-7xl lg:text-8xl mb-6">
            CICERO
          </h1>
          
          {/* Tagline */}
          <p className="text-muted-foreground text-lg mb-12 text-balance">
            Stay informed on what's happening at Fort Collins City Council in 15 minutes or less.
          </p>
          
          {/* Button */}
          <div className="max-w-xs mx-auto mb-16">
            <Link
              href="/meetings"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-foreground/20 rounded-md hover:border-foreground/40 transition-colors text-foreground w-full"
            >
              View Meetings
              <ArrowRight className="size-4" />
            </Link>
          </div>
          
          {/* Email signup */}
          <div id="subscribe" className="pt-8 border-t border-foreground/10">
            <p className="text-sm text-muted-foreground mb-4">
              Get notified when new meeting summaries are published.
            </p>
            <SubscribeForm />
          </div>
        </div>
      </main>
      
      {/* Minimal footer */}
      <footer className="py-8 text-center">
        <p className="text-sm text-muted-foreground">
          Fort Collins, Colorado
        </p>
      </footer>
    </div>
  );
}
