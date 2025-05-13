import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { useSession } from '@/app/contexts/session-context'
import { ArrowUpRight, DollarSign, LineChart, ShoppingCart, Users } from 'lucide-react'

export default function Dashboard() {
  const { user, isLoading } = useSession()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {['skeleton-1', 'skeleton-2', 'skeleton-3', 'skeleton-4'].map(skeletonId => (
          <Card key={skeletonId} className="animate-pulse w-full">
            <CardHeader className="space-y-2">
              <div className="h-5 w-1/2 rounded bg-muted" />
              <div className="h-4 w-1/3 rounded bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-3/4 rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      description: '12% increase from last month',
      icon: <DollarSign className="h-5 w-5 text-muted-foreground" />,
      trend: 'up',
    },
    {
      title: 'Active Users',
      value: '2,350',
      description: '5% increase from last week',
      icon: <Users className="h-5 w-5 text-muted-foreground" />,
      trend: 'up',
    },
    {
      title: 'Sales',
      value: '12,234',
      description: '3% decrease from yesterday',
      icon: <ShoppingCart className="h-5 w-5 text-muted-foreground" />,
      trend: 'down',
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      description: '1.1% increase from last month',
      icon: <LineChart className="h-5 w-5 text-muted-foreground" />,
      trend: 'up',
    },
  ]

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || 'User'}!</h1>
        <p className="text-muted-foreground">Here's what's happening with your account today.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <Card key={stat.title} className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                ) : (
                  <ArrowUpRight className="h-3 w-3 text-red-500 rotate-90" />
                )}
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your current profile details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p>{user?.name || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{user?.email || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Email Verified</p>
                <p>{user?.emailVerified ? 'Yes' : 'No'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
