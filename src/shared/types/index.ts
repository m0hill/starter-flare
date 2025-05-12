import type { getAuth } from '@/api/lib/auth'

export type User = ReturnType<typeof getAuth>['$Infer']['Session']['user']
export type Session = ReturnType<typeof getAuth>['$Infer']['Session']['session']
