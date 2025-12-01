import React from 'react'
import { Menu as MenuIcon, Info, BookOpen, HelpCircle, Calculator, Download } from 'lucide-react'

export default function Menu({ onMenuClick, activeMenu }) {
  const [isOpen, setIsOpen] = React.useState(false)

  const menuItems = [
    { id: 'home', label: 'Главная', icon: MenuIcon },
    { id: 'calculations', label: 'Расчёты', icon: Calculator },
    { id: 'export', label: 'Запись результатов', icon: Download },
    { id: 'help', label: 'Справка', icon: HelpCircle },
    { id: 'theme', label: 'Тема', icon: BookOpen },
    { id: 'about', label: 'Автор', icon: Info },
  ]

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-blue-600">ДКА Конструктор</h1>
            <div className="hidden md:flex space-x-1">
              {menuItems.map(item => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onMenuClick(item.id)
                      setIsOpen(false)
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                      activeMenu === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <button
            onClick={toggleMenu}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <MenuIcon size={24} />
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 border-t">
            {menuItems.map(item => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onMenuClick(item.id)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center space-x-2 px-4 py-3 text-left transition ${
                    activeMenu === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </nav>
  )
}
