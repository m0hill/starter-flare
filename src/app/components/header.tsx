import { ModeToggle } from '@/app/components/mode-toggle'
import { Link } from 'react-router'

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="../" className="flex items-center gap-2">
          <span className="text-xl font-bold">Brand</span>
        </Link>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <nav className="flex gap-4">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
