import { Button } from '@/app/components/ui/button'
import { useNavigate } from 'react-router'

export function meta() {
  return [
    { title: 'Page Not Found' },
    { name: 'description', content: "The page you're looking for doesn't exist" },
  ]
}

export default function CatchAllRoute() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1)
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-lg mb-8">
        The page you're looking for doesn't exist or is still under development.
      </p>
      <Button onClick={goBack}>
        Go Back
      </Button>
    </div>
  )
}