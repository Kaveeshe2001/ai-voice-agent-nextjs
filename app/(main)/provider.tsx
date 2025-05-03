import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React, { ReactNode } from 'react'
import { AppSidebar } from './_components/AppSidebar'
import WelcomeContainer from './dashboard/_components/WelcomeContainer'

interface ProviderProps {
  children: ReactNode
}

const DashboardProvider = ({ children }: ProviderProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className='w-full'>
        <SidebarTrigger />
        <WelcomeContainer />
        {children}
      </div>
    </SidebarProvider>
  )
}

export default DashboardProvider
