import React, { ReactNode } from 'react'
import DashboardProvider from './provider'

interface DashboardLayoutProps {
  children: ReactNode
}

const DashboardLayout = ({ children }:DashboardLayoutProps) => {
  return (
    <div>
      <DashboardProvider>
        {children}
      </DashboardProvider>
    </div>
  )
}

export default DashboardLayout
