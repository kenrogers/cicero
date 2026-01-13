import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SubscribeForm } from './SubscribeForm'

export default function CallToAction() {
    return (
        <section className="py-16 md:py-24">
            <div className="mx-auto max-w-4xl px-6">
                <div className="relative rounded-3xl border bg-gradient-to-b from-muted/50 to-muted/30 p-8 md:p-12 text-center overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                    
                    <div className="relative">
                        <h2 className="text-balance text-3xl md:text-4xl font-semibold">
                            Stay informed about your city
                        </h2>
                        <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
                            Get notified when new meeting summaries are published, or browse existing summaries now.
                        </p>

                        <div className="mt-8">
                            <SubscribeForm />
                        </div>

                        <div className="mt-6 flex justify-center">
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="gap-2">
                                <Link href="/meetings">
                                    <span>Browse Summaries</span>
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                        </div>

                        <p className="mt-8 text-sm text-muted-foreground">
                            Free and open source. Built for Fort Collins residents.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
