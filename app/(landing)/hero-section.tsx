import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeroHeader } from "./header"
import { ArrowRight, Building2 } from 'lucide-react'

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
                                    <Building2 className="size-4" />
                                    <span>Fort Collins City Council</span>
                                </div>
                                <h1 className="mx-auto mt-2 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                                    City Council meetings,{' '}
                                    <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                        summarized.
                                    </span>
                                </h1>
                                <p className="text-muted-foreground mx-auto mt-6 mb-8 max-w-2xl text-balance text-lg md:text-xl">
                                    AI-powered summaries of Fort Collins City Council meetings. 
                                    Get the key decisions, action items, and topics that matter—without watching hours of video.
                                </p>

                                <div className="flex items-center justify-center gap-3 mb-8">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="gap-2">
                                        <Link href="/meetings">
                                            <span className="text-nowrap">Browse Summaries</span>
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="lg"
                                        variant="outline">
                                        <Link href="#how-it-works">
                                            <span className="text-nowrap">How It Works</span>
                                        </Link>
                                    </Button>
                                </div>

                                {/* Stats preview */}
                                <div className="mx-auto max-w-md">
                                    <div className="rounded-xl border bg-card p-4 shadow-lg">
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div>
                                                <div className="text-2xl font-bold text-primary">2-3 hrs</div>
                                                <div className="text-xs text-muted-foreground">Avg. meeting length</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-primary">5 min</div>
                                                <div className="text-xs text-muted-foreground">Summary read time</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-primary">Free</div>
                                                <div className="text-xs text-muted-foreground">Always</div>
                                            </div>
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
