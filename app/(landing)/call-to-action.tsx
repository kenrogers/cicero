import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Github } from 'lucide-react'

export default function CallToAction() {
    return (
        <section className="py-16 md:py-24">
            <div className="mx-auto max-w-4xl px-6">
                <div className="relative rounded-3xl border bg-gradient-to-b from-muted/50 to-muted/30 p-8 md:p-12 text-center overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                    
                    <div className="relative">
                        <h2 className="text-balance text-3xl md:text-4xl font-semibold">
                            Stop rebuilding the same foundation over and over.
                        </h2>
                        <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
                            Auth, payments, real-time data, security, and a workflow system that actually helps you ship.
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <Button
                                asChild
                                size="lg"
                                className="gap-2">
                                <Link href="https://github.com/kenrogers/vibe-coders-starter-kit">
                                    <Github className="size-4" />
                                    <span>Use This Template</span>
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>

                            <Button
                                asChild
                                size="lg"
                                variant="outline">
                                <Link href="https://skool.com/vibecoders/about">
                                    <span>Join Vibe Coders</span>
                                </Link>
                            </Button>
                        </div>

                        <p className="mt-8 text-sm text-muted-foreground">
                            Built with ❤️ by{' '}
                            <Link href="https://kenrogers.co" className="underline hover:text-foreground transition-colors">
                                Ken Rogers
                            </Link>
                            {' '}for the{' '}
                            <Link href="https://skool.com/vibecoders/about" className="underline hover:text-foreground transition-colors">
                                Vibe Coders
                            </Link>
                            {' '}community
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
