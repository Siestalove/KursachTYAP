import React from 'react'
import HomePage from './pages/HomePage'
import CalculationsPage from './pages/CalculationsPage'
import ExportPage from './pages/ExportPage'

export default function MainView({ activeMenu }) {
  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-4">
        {activeMenu === 'home' && <HomePage />}
        {activeMenu === 'calculations' && <CalculationsPage />}
        {activeMenu === 'export' && <ExportPage />}
      </div>
    </div>
  )
}
