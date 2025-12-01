import React, { useState } from 'react'
import { Menu as MenuIcon, Info, BookOpen, HelpCircle, Calculator, Download } from 'lucide-react'
import { styles } from '../styles'

export default function Menu({ onMenuClick, activeMenu }) {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { id: 'calculations', label: 'Расчёты', icon: Calculator },
    { id: 'export', label: 'Запись результатов', icon: Download },
    { id: 'help', label: 'Справка', icon: HelpCircle },
    { id: 'theme', label: 'Тема', icon: BookOpen },
    { id: 'about', label: 'Автор', icon: Info },
  ]

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav style={styles.navBar}>
      <div style={styles.navContainer}>
        <h1 style={styles.navTitle}>ДКА Конструктор</h1>
        
        <ul style={{ ...styles.navMenu, display: 'flex' }}>
          {menuItems.map(item => {
            const Icon = item.icon
            const isActive = activeMenu === item.id
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    onMenuClick(item.id)
                    setIsOpen(false)
                  }}
                  style={{
                    ...styles.navButton,
                    ...(isActive ? styles.navButtonActive : {}),
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.target.style.backgroundColor = '#e5e7eb'
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.target.style.backgroundColor = 'transparent'
                  }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>

        <button
          onClick={toggleMenu}
          style={{
            ...styles.button,
            display: 'none',
            backgroundColor: 'transparent',
            color: '#374151',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <MenuIcon size={24} />
        </button>
      </div>

      {isOpen && (
        <div style={{ borderTop: '1px solid #e5e7eb' }}>
          {menuItems.map(item => {
            const Icon = item.icon
            const isActive = activeMenu === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  onMenuClick(item.id)
                  setIsOpen(false)
                }}
                style={{
                  ...styles.navButton,
                  width: '100%',
                  justifyContent: 'flex-start',
                  padding: '12px 16px',
                  ...(isActive ? styles.navButtonActive : {}),
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.target.style.backgroundColor = '#e5e7eb'
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.target.style.backgroundColor = 'transparent'
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </nav>
  )
}
