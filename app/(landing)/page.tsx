import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SubscribeForm } from "./SubscribeForm";
import { GradientMesh } from "./GradientMesh";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background */}
      <GradientMesh />
      
      {/* Hero - full height centered */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 relative z-10">
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
          <div className="max-w-sm mx-auto mb-16">
            <Link
              href="/meetings"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 text-lg font-medium w-full shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              View Meetings
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
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
      <footer className="py-8 text-center relative z-10">
        <p className="text-sm text-muted-foreground">
          Fort Collins, Colorado
        </p>
      </footer>
    </div>
  );
}
