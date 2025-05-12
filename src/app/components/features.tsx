import { CheckCircle } from 'lucide-react'

export default function Features() {
  return (
    <section className="w-full py-12 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Why Choose Us</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              We provide the best service with the simplest solutions.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
            <CheckCircle className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Simple</h3>
            <p className="text-center text-muted-foreground">
              Our solutions are easy to use and understand.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
            <CheckCircle className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Fast</h3>
            <p className="text-center text-muted-foreground">
              Lightning fast performance for your applications.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
            <CheckCircle className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Secure</h3>
            <p className="text-center text-muted-foreground">
              Your data is always safe and protected with us.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
