import { Link } from 'react-router'

export default function Footer() {
  return (
    <footer className="w-full border-t py-6">
      <div className="container mx-auto max-w-7xl flex flex-col items-center justify-center gap-4 px-4 md:px-6">
        <div className="flex gap-4 text-sm text-muted-foreground">
          <Link to="../about" className="hover:underline">
            About
          </Link>
          <Link to="../privacy" className="hover:underline">
            Privacy
          </Link>
          <Link to="../terms" className="hover:underline">
            Terms
          </Link>
          <Link to="../contact" className="hover:underline">
            Contact
          </Link>
        </div>
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Brand. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
