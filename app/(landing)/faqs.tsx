export default function FAQs() {
    return (
        <section className="scroll-py-16 py-12 md:scroll-py-12 md:py-16">
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid gap-y-12 px-2 lg:[grid-template-columns:1fr_auto]">
                    <div className="text-center lg:text-left">
                        <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
                            Frequently <br className="hidden lg:block" /> Asked <br className="hidden lg:block" />
                            Questions
                        </h2>
                        <p className="text-muted-foreground">Everything you need to know about getting started.</p>
                    </div>

                    <div className="divide-y divide-dashed sm:mx-auto sm:max-w-lg lg:mx-0">
                        <div className="pb-6">
                            <h3 className="font-medium">What AI tools does this work with?</h3>
                            <p className="text-muted-foreground mt-4">
                                The Vibe Coders Starter Kit works with any AI coding assistant that supports custom instructions or system prompts. 
                                It&apos;s been tested extensively with Cursor, Claude, and Amp. The skills and workflow system use markdown files 
                                that any AI can read and follow.
                            </p>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">Is this just another boilerplate?</h3>
                            <p className="text-muted-foreground mt-4">
                                No. Most boilerplates give you a starting point, then you&apos;re on your own. This template includes 
                                the <strong>/work workflow system</strong> that guides every coding session, a <strong>skills library</strong> 
                                with pre-built patterns, and a <strong>learning system</strong> that captures what works. The infrastructure 
                                (auth, payments, database) is just the foundation.
                            </p>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">Do I need to pay for Clerk or Convex?</h3>
                            <p className="text-muted-foreground my-4">
                                Both Clerk and Convex have generous free tiers that work great for development and small projects:
                            </p>
                            <ul className="list-outside list-disc space-y-2 pl-4">
                                <li className="text-muted-foreground"><strong>Clerk:</strong> 10,000 monthly active users free</li>
                                <li className="text-muted-foreground"><strong>Convex:</strong> Generous free tier for hobby projects</li>
                            </ul>
                            <p className="text-muted-foreground mt-4">
                                You can build and launch a real product without paying anything until you have significant usage.
                            </p>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">How do the lessons work?</h3>
                            <p className="text-muted-foreground mt-4">
                                When you complete work, the system prompts you to capture learnings. These get saved as skill files 
                                in <code className="text-sm bg-muted px-1 rounded">.agents/skills/lessons/</code>. Next time you work on something similar, 
                                the <code className="text-sm bg-muted px-1 rounded">/work</code> command automatically finds and applies relevant lessons. 
                                Your knowledge compounds over time.
                            </p>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">Can I remove features I don&apos;t need?</h3>
                            <p className="text-muted-foreground mt-4">
                                Absolutely. Everything is modular. Don&apos;t need payments? Remove the Clerk Billing integration. 
                                Don&apos;t need the security dashboard? Delete those components. The workflow and skills system 
                                work independently of the infrastructure choices.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
