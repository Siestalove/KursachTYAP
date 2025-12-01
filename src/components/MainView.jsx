import React from 'react'
import CalculationsPage from './pages/CalculationsPage'
import ExportPage from './pages/ExportPage'
import { styles } from '../styles'

export default function MainView({ activeMenu }) {
  return (
    <div style={styles.pageContainer} className="page-container">
      {activeMenu === 'calculations' && <CalculationsPage />}
      {activeMenu === 'export' && <ExportPage />}
    </div>
  )
}
