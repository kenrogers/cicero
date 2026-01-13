import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
    FileText, 
    CheckCircle, 
    Bell, 
    Clock,
    Vote,
    Users
} from 'lucide-react'

const features = [
    {
        icon: FileText,
        title: "Meeting Summaries",
        description: "Every City Council meeting distilled into clear, readable summaries with key topics highlighted.",
        badge: "Core"
    },
    {
        icon: Vote,
        title: "Decisions Tracked",
        description: "See what was voted on, who voted how, and what passed or failed—all in one place.",
        badge: "Core"
    },
    {
        icon: CheckCircle,
        title: "Action Items",
        description: "Know how to get involved. Each summary includes ways to take action on issues you care about.",
        badge: "Core"
    },
    {
        icon: Bell,
        title: "Email Alerts",
        description: "Get notified when new summaries are ready. Never miss an important council decision.",
        badge: "Coming Soon"
    },
    {
        icon: Clock,
        title: "Save Hours",
        description: "Council meetings run 2-3 hours. Our summaries take 5 minutes to read.",
        badge: "Benefit"
    },
    {
        icon: Users,
        title: "Civic Engagement",
        description: "Stay informed about your city without the time commitment. Democracy made accessible.",
        badge: "Benefit"
    },
]

export default function FeaturesSection() {
    return (
        <section className="py-16 md:py-24 bg-muted/30">
            <div className="mx-auto w-full max-w-6xl px-6">
                <div className="text-center mb-12">
                    <Badge variant="outline" className="mb-4">What You Get</Badge>
                    <h2 className="text-foreground text-3xl md:text-4xl font-semibold">
                        Everything you need to stay informed
                    </h2>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
                        AI-powered analysis of every City Council meeting, delivered in a format you can actually use.
                    </p>
                </div>

                {/* Features grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            </div>
        </section>
    )
}
