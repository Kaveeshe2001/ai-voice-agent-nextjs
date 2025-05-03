import React, { ReactNode } from 'react'
import DashboardProvider from './provider'

interface DashboardLayoutProps {
  children: ReactNode
}

const DashboardLayout = ({ children }:DashboardLayoutProps) => {
  return (
    <div>
      <DashboardProvider>
        <div className='p-10'>
          {children}
        </div>
      </DashboardProvider>
    </div>
  )
}

export default DashboardLayout
