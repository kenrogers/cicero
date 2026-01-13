import { Badge } from '@/components/ui/badge'
import { Video, FileAudio, Brain, Mail } from 'lucide-react'

export default function WorkflowSection() {
    return (
        <section id="how-it-works" className="py-16 md:py-24">
            <div className="mx-auto w-full max-w-5xl px-6">
                <div className="text-center mb-12">
                    <Badge variant="outline" className="mb-4">How It Works</Badge>
                    <h2 className="text-foreground text-3xl md:text-4xl font-semibold">
                        From meeting to summary in hours
                    </h2>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
                        We automatically process City Council meetings so you don&apos;t have to watch them.
                    </p>
                </div>

                {/* Pipeline diagram */}
                <div className="bg-card border rounded-2xl p-6 md:p-8">
                    <div className="grid gap-6 md:grid-cols-4">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center size-14 rounded-full bg-primary/10 text-primary mb-4">
                                <Video className="size-6" />
                            </div>
                            <h3 className="font-semibold mb-2">1. Capture</h3>
                            <p className="text-sm text-muted-foreground">
                                Meeting videos are automatically detected from the city&apos;s public archive.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center size-14 rounded-full bg-primary/10 text-primary mb-4">
                                <FileAudio className="size-6" />
                            </div>
                            <h3 className="font-semibold mb-2">2. Transcribe</h3>
                            <p className="text-sm text-muted-foreground">
                                Audio is converted to text using state-of-the-art speech recognition.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center size-14 rounded-full bg-primary/10 text-primary mb-4">
                                <Brain className="size-6" />
                            </div>
                            <h3 className="font-semibold mb-2">3. Analyze</h3>
                            <p className="text-sm text-muted-foreground">
                                AI extracts key topics, decisions, votes, and action items.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center size-14 rounded-full bg-primary/10 text-primary mb-4">
                                <Mail className="size-6" />
                            </div>
                            <h3 className="font-semibold mb-2">4. Deliver</h3>
                            <p className="text-sm text-muted-foreground">
                                Summaries are published online and sent to email subscribers.
                            </p>
                        </div>
                    </div>

                    {/* Connection lines for desktop */}
                    <div className="hidden md:block mt-6">
                        <div className="flex justify-between px-[calc(12.5%-14px)]">
                            <div className="h-0.5 flex-1 bg-border mt-2 mx-4" />
                            <div className="h-0.5 flex-1 bg-border mt-2 mx-4" />
                            <div className="h-0.5 flex-1 bg-border mt-2 mx-4" />
                        </div>
                    </div>
                </div>

                {/* Data sources */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground mb-3">Data sourced from official city records</p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <div className="flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm">
                            <span className="font-medium">Municode</span>
                            <span className="text-muted-foreground text-xs">• Agendas</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm">
                            <span className="font-medium">Cablecast</span>
                            <span className="text-muted-foreground text-xs">• Videos</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
