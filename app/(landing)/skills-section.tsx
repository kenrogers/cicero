import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Folder, ArrowRight } from 'lucide-react'

const skillCategories = [
    {
        name: "security/",
        description: "CSRF, rate limiting, validation, auth patterns",
        skills: ["csrf-protection", "rate-limiting", "input-validation", "auth-security"]
    },
    {
        name: "gsd/",
        description: "Project management and planning system",
        skills: ["work", "plan", "execute", "roadmap"]
    },
    {
        name: "frontend-design/",
        description: "UI patterns that avoid generic AI aesthetics",
        skills: ["design-system", "components", "layouts"]
    },
    {
        name: "lessons/",
        description: "YOUR learnings (grows over time)",
        skills: ["auto-captured", "searchable", "compound"]
    },
]

const exampleTriggers = [
    { prompt: "Add rate limiting to this endpoint", skill: "rate-limiting" },
    { prompt: "Build a landing page", skill: "frontend-design" },
    { prompt: "Protect this form from CSRF", skill: "csrf-protection" },
    { prompt: "Set up authentication", skill: "auth-security" },
]

export default function SkillsSection() {
    return (
        <section className="py-16 md:py-24">
            <div className="mx-auto w-full max-w-5xl px-6">
                <div className="text-center mb-12">
                    <Badge variant="outline" className="mb-4">Skills System</Badge>
                    <h2 className="text-foreground text-3xl md:text-4xl font-semibold">
                        Best practices that activate automatically
                    </h2>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
                        Skills are specialized instructions that load when you need them. 
                        No need to remember the right way to do things.
                    </p>
                </div>

                {/* Skills directory */}
                <div className="bg-card border rounded-2xl p-6 mb-12">
                    <div className="font-mono text-sm mb-4 text-muted-foreground">
                        .agents/skills/
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                        {skillCategories.map((category, index) => (
                            <Card key={index} className="bg-muted/30 border-dashed">
                                <CardContent className="pt-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Folder className="size-4 text-primary" />
                                        <span className="font-mono font-medium">{category.name}</span>
                                    </div>
                                    <p className="text-muted-foreground text-sm mb-3">
                                        {category.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {category.skills.map((skill, i) => (
                                            <Badge key={i} variant="secondary" className="text-xs font-mono">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* How skills work */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-center">
                        Describe your task, skills load automatically
                    </h3>
                    <div className="space-y-2">
                        {exampleTriggers.map((trigger, index) => (
                            <div 
                                key={index}
                                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-transparent hover:border-border transition-colors"
                            >
                                <span className="text-muted-foreground shrink-0">&quot;</span>
                                <span className="flex-1">{trigger.prompt}</span>
                                <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                                <Badge variant="outline" className="font-mono shrink-0">
                                    {trigger.skill}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Learning timeline */}
                <div className="mt-16">
                    <h3 className="text-lg font-semibold mb-6 text-center">
                        Your knowledge compounds over time
                    </h3>
                    <div className="grid gap-4 md:grid-cols-4">
                        {[
                            { time: "Week 1", description: "Empty lessons, learn as you go" },
                            { time: "Week 2", description: "Past lessons surface automatically" },
                            { time: "Month 1", description: "Most tasks have relevant experience" },
                            { time: "Month 3", description: "Full institutional knowledge base" },
                        ].map((phase, index) => (
                            <div key={index} className="text-center">
                                <div className="text-2xl font-bold text-primary mb-1">{phase.time}</div>
                                <p className="text-muted-foreground text-sm">{phase.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
