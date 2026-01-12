import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeroHeader } from "./header"
import { ArrowRight, Terminal } from 'lucide-react'

export default function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main>
                <section className="">
                    <div className="pt-8 pb-4 md:pt-12 md:pb-6">
                        <div className="relative z-10 mx-auto max-w-5xl pt-6 px-6 text-center">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground mb-6">
                                    <Terminal className="size-4" />
                                    <span>Built for vibe coders who ship</span>
                                </div>
                                <h1 className="mx-auto mt-2 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                                    Stop rebuilding foundations.{' '}
                                    <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                        Start shipping.
                                    </span>
                                </h1>
                                <p className="text-muted-foreground mx-auto mt-6 mb-8 max-w-2xl text-balance text-lg md:text-xl">
                                    The production-ready starter template that gives you auth, payments, real-time database, 
                                    security, and a workflow system that actually helps you ship—not just prototype.
                                </p>

                                <div className="flex items-center justify-center gap-3 mb-8">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="gap-2">
                                        <Link href="https://github.com/kenrogers/vibe-coders-starter-kit">
                                            <span className="text-nowrap">Use This Template</span>
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="lg"
                                        variant="outline">
                                        <Link href="https://skool.com/vibecoders/about">
                                            <span className="text-nowrap">Join the Community</span>
                                        </Link>
                                    </Button>
                                </div>

                                {/* Code snippet preview */}
                                <div className="mx-auto max-w-md">
                                    <div className="rounded-xl border bg-card p-4 text-left font-mono text-sm shadow-lg">
                                        <div className="flex items-center gap-2 text-muted-foreground mb-3">
                                            <div className="flex gap-1.5">
                                                <div className="size-3 rounded-full bg-red-500/80" />
                                                <div className="size-3 rounded-full bg-yellow-500/80" />
                                                <div className="size-3 rounded-full bg-green-500/80" />
                                            </div>
                                            <span className="text-xs">terminal</span>
                                        </div>
                                        <div className="space-y-1">
                                            <p><span className="text-muted-foreground">$</span> <span className="text-primary">/work</span></p>
                                            <p className="text-muted-foreground text-xs">→ Loads context, checks lessons, guides execution</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
