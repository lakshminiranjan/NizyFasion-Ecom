import React from 'react'
import { Outlet } from 'react-router'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

function DashboardLayout() {
  return (
    <div className='drawer lg:drawer-open'>

      <input type="checkbox" className="drawer-toggle" id="my-drawer" defaultChecked />
      <div className='drawer-content'>
        <Navbar />
        <main className='p-6'>
          <Outlet />
        </main>
      </div>
      <Sidebar />
    </div>
  )
}

export default DashboardLayout