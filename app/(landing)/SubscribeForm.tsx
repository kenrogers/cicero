"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, CheckCircle2 } from "lucide-react";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const subscribe = useMutation(api.subscribers.subscribe);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) return;

    setStatus("loading");
    
    try {
      const result = await subscribe({ email });
      
      if (result.success) {
        setStatus("success");
        setMessage(result.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(result.message);
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center justify-center gap-2 text-primary">
        <CheckCircle2 className="size-5" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status === "error") setStatus("idle");
        }}
        className="flex-1 px-4 py-3 bg-card border border-foreground/10 rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        disabled={status === "loading"}
        required
      />
      <button
        type="submit"
        disabled={status === "loading" || !email.trim()}
        className="px-6 py-3 bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <span className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Subscribing...
          </span>
        ) : (
          "Subscribe"
        )}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-400 sm:absolute sm:-bottom-6 sm:left-0">{message}</p>
      )}
    </form>
  );
}
