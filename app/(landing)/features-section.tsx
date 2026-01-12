import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
    Workflow, 
    BookOpen, 
    Shield, 
    Palette, 
    Database,
    CreditCard,
    Lock,
    Zap
} from 'lucide-react'

const features = [
    {
        icon: Workflow,
        title: "Workflow System",
        description: "The /work command guides every session with predictable, proven loops for planning and execution.",
        badge: "Core"
    },
    {
        icon: BookOpen,
        title: "Skills Library",
        description: "Pre-built patterns for security, design, and common tasks that activate when you need them.",
        badge: "Core"
    },
    {
        icon: Zap,
        title: "Learning System",
        description: "Captures what works and applies it automatically. Your institutional knowledge grows over time.",
        badge: "Core"
    },
    {
        icon: Lock,
        title: "Authentication",
        description: "Complete auth with Clerk—users, sessions, social login, all wired up and ready to go.",
        badge: "Infrastructure"
    },
    {
        icon: CreditCard,
        title: "Payments",
        description: "Subscription billing with Clerk Billing and Stripe. No payment code to write yourself.",
        badge: "Infrastructure"
    },
    {
        icon: Database,
        title: "Real-time Database",
        description: "Convex gives you a serverless, real-time database with automatic syncing.",
        badge: "Infrastructure"
    },
    {
        icon: Shield,
        title: "Security by Default",
        description: "CSRF protection, rate limiting, input validation, XSS prevention—all built in.",
        badge: "Security"
    },
    {
        icon: Palette,
        title: "Design System",
        description: "Professional patterns that avoid generic AI aesthetics. Your apps won't look like demos.",
        badge: "Design"
    },
]

const techStack = [
    { name: "Next.js 15", category: "Framework" },
    { name: "TailwindCSS v4", category: "Styling" },
    { name: "shadcn/ui", category: "Components" },
    { name: "Convex", category: "Database" },
    { name: "Clerk", category: "Auth" },
    { name: "Stripe", category: "Payments" },
]

export default function FeaturesSection() {
    return (
        <section className="py-16 md:py-24 bg-muted/30">
            <div className="mx-auto w-full max-w-6xl px-6">
                <div className="text-center mb-12">
                    <Badge variant="outline" className="mb-4">Everything You Need</Badge>
                    <h2 className="text-foreground text-3xl md:text-4xl font-semibold">
                        Production-ready from day one
                    </h2>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
                        Not just a starter template—a complete system for building and shipping real applications.
                    </p>
                </div>

                {/* Features grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-16">
                    {features.map((feature, index) => (
                        <Card key={index} className="bg-card/50 hover:bg-card transition-colors">
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <feature.icon className="size-5 text-primary" />
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                        {feature.badge}
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg mt-3">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Tech stack */}
                <div className="text-center">
                    <p className="text-muted-foreground text-sm mb-4">Built with modern tools</p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {techStack.map((tech, index) => (
                            <div 
                                key={index}
                                className="flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm"
                            >
                                <span className="font-medium">{tech.name}</span>
                                <span className="text-muted-foreground text-xs">• {tech.category}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
