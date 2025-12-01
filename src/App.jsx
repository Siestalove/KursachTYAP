import React, { useState } from 'react'
import Menu from './components/Menu'
import MainView from './components/MainView'
import AboutModal from './components/modals/AboutModal'
import ThemeModal from './components/modals/ThemeModal'
import HelpModal from './components/modals/HelpModal'
import { styles } from './styles'

export default function App() {
  const [activeMenu, setActiveMenu] = useState('calculations')
  const [showAbout, setShowAbout] = useState(false)
  const [showTheme, setShowTheme] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const handleMenuClick = (item) => {
    if (item === 'about') {
      setShowAbout(true)
    } else if (item === 'theme') {
      setShowTheme(true)
    } else if (item === 'help') {
      setShowHelp(true)
    } else {
      setActiveMenu(item)
    }
  }

  return (
    <div style={styles.container} className="app-container">
      <Menu onMenuClick={handleMenuClick} activeMenu={activeMenu} />
      <div style={styles.mainContent} className="main-content">
        <MainView activeMenu={activeMenu} />
      </div>

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showTheme && <ThemeModal onClose={() => setShowTheme(false)} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  )
}
