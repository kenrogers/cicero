import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, GitBranch, Layers, Repeat, Zap } from 'lucide-react'

export default function WorkflowSection() {
    return (
        <section className="py-16 md:py-24">
            <div className="mx-auto w-full max-w-5xl px-6">
                <div className="text-center mb-12">
                    <Badge variant="outline" className="mb-4">The /work Workflow</Badge>
                    <h2 className="text-foreground text-3xl md:text-4xl font-semibold">
                        One command to rule them all
                    </h2>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
                        Instead of writing prompts from scratch, use a single command that handles 
                        planning, execution, and learning automatically.
                    </p>
                </div>

                {/* Workflow diagram */}
                <div className="bg-card border rounded-2xl p-6 md:p-8 mb-12">
                    <div className="font-mono text-sm md:text-base">
                        <div className="border border-border rounded-lg p-4 md:p-6 bg-muted/30">
                            <div className="text-center text-lg md:text-xl font-semibold mb-4 text-primary">/work</div>
                            <div className="border-t border-border pt-4 space-y-3 md:space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary shrink-0">
                                        <Brain className="size-4" />
                                    </div>
                                    <div>
                                        <span className="font-semibold">1. LEARN</span>
                                        <span className="text-muted-foreground ml-2">- Auto-check lessons for relevant learnings</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary shrink-0">
                                        <Zap className="size-4" />
                                    </div>
                                    <div>
                                        <span className="font-semibold">2. DO</span>
                                        <span className="text-muted-foreground ml-2">- Route to appropriate GSD action</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary shrink-0">
                                        <Repeat className="size-4" />
                                    </div>
                                    <div>
                                        <span className="font-semibold">3. CAPTURE</span>
                                        <span className="text-muted-foreground ml-2">- Prompt for retrospective when done</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Problem/Solution grid */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="bg-red-500/5 border-red-500/20">
                        <CardContent className="pt-6">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <span className="text-red-500">✕</span> The Problem
                            </h3>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">•</span>
                                    <span>Repeating the same mistakes across sessions</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">•</span>
                                    <span>Lost context between coding sessions</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">•</span>
                                    <span>Forgotten lessons that never compound</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">•</span>
                                    <span>Vague AI prompts that produce inconsistent results</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="bg-green-500/5 border-green-500/20">
                        <CardContent className="pt-6">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <span className="text-green-500">✓</span> The Solution
                            </h3>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>Past lessons surface automatically before you start</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>Reads project state and picks up where you left off</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>Prompts you to capture learnings when work completes</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>Plans are structured, executable, and atomic</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
