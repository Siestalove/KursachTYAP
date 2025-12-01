import React from 'react'
import HomePage from './pages/HomePage'
import CalculationsPage from './pages/CalculationsPage'
import ExportPage from './pages/ExportPage'
import { styles } from '../styles'

export default function MainView({ activeMenu }) {
  return (
    <div style={styles.pageContainer} className="page-container">
      {activeMenu === 'home' && <HomePage />}
      {activeMenu === 'calculations' && <CalculationsPage />}
      {activeMenu === 'export' && <ExportPage />}
    </div>
  )
}
