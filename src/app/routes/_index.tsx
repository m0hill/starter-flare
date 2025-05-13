import Features from '@/app/components/features'
import Footer from '@/app/components/footer'
import Header from '@/app/components/header'
import { Button } from '@/app/components/ui/button'
import { useRedirectIfAuthenticated } from '@/app/lib/auth'
import { Link } from 'react-router'
import type { MetaFunction } from 'react-router'

export const meta: MetaFunction = () => {
  return [
    { title: 'Welcome to Our Platform' },
    { name: 'description', content: 'The simplest solution for your complex problems.' },
  ]
}

export default function Index() {
  const isChecking = useRedirectIfAuthenticated('/dashboard')

  if (isChecking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div
          className="w-10 h-10 border-4 border-t-primary rounded-full animate-spin"
          aria-label="Loading"
          role="status"
        />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Welcome to Our Platform
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  The simplest solution for your complex problems.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button asChild size="lg">
                  <Link to="../signup">Get Started</Link>
                </Button>
                <Button variant="outline" asChild size="lg">
                  <Link to="../learn-more">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <Features />
      </main>
      <Footer />
    </div>
  )
}
