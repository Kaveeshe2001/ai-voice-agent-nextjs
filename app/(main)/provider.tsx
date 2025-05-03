import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React, { ReactNode } from 'react'
import { AppSidebar } from './_components/AppSidebar'

interface ProviderProps {
  children: ReactNode
}

const DashboardProvider = ({ children }: ProviderProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div>
        <SidebarTrigger />
        {children}
      </div>
    </SidebarProvider>
  )
}

export default DashboardProvider
