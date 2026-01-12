export default function PaymentGatedPage() {
  return (
    <div className="px-4 lg:px-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Premium Features</h1>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Coming Soon</h2>
          <p className="text-muted-foreground">
            Premium features will be available here once billing is enabled.
          </p>
        </div>
      </div>
    </div>
  )
} 