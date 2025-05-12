import {
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  BarChart4,
  FileText,
  Users,
  CreditCard
} from 'lucide-react'
import { Link } from 'react-router'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator
} from '@/app/components/ui/sidebar'
import { useSession } from '@/app/contexts/session-context'
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { authClient } from '@/app/lib/auth'
import { useNavigate } from 'react-router'

export function DashboardSidebar() {
  const { user } = useSession()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await authClient.signOut()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  const mainNavItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
      isActive: true
    },
    {
      title: 'Analytics',
      icon: BarChart4,
      href: '/analytics'
    },
    {
      title: 'Documents',
      icon: FileText,
      href: '/documents'
    },
    {
      title: 'Users',
      icon: Users,
      href: '/users'
    }
  ]

  const secondaryNavItems = [
    {
      title: 'Account',
      icon: User,
      href: '/account'
    },
    {
      title: 'Billing',
      icon: CreditCard,
      href: '/billing'
    },
    {
      title: 'Settings',
      icon: Settings,
      href: '/settings'
    }
  ]

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="font-bold">U</span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Upresume</span>
                <span className="truncate text-xs">Admin Dashboard</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <Link to={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {user && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <Avatar className="h-8 w-8 rounded-lg">
                  {user.image ? (
                    <AvatarImage src={user.image} alt={user.name || ''} />
                  ) : null}
                  <AvatarFallback className="rounded-lg">
                    {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name || 'User'}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut />
                <span>Log out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  )
}