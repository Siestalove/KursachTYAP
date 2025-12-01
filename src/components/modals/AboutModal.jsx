import React from 'react'
import { X } from 'lucide-react'
import { styles } from '../../styles'

export default function AboutModal({ onClose }) {
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#374151' }}>Об авторе</h2>
          <button
            onClick={onClose}
            style={{ padding: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#374151' }}>
          <div>
            <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>Информация о разработчике</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
              Данное приложение было разработано для решения курсовой работы по теме
              "Построение конструкций, задающих язык" в рамках дисциплины "Теория
              автоматов и формальных языков" (ТАУЯ).
            </p>
          </div>

          <div>
            <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>Цель приложения</h3>
            <p style={{ fontSize: '14px', marginBottom: '8px' }}>
              Приложение предназначено для:
            </p>
            <ul style={{ paddingLeft: '20px', fontSize: '14px', space: '4px', lineHeight: '1.6' }}>
              <li>Построения детерминированного конечного автомата (ДКА)</li>
              <li>Проверки цепочек на принадлежность языку</li>
              <li>Визуализации функции переходов в виде таблицы и графа</li>
              <li>Экспорта результатов в различные форматы</li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>Технологии</h3>
            <p style={{ fontSize: '14px', marginBottom: '8px' }}>
              Приложение разработано на:
            </p>
            <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.6' }}>
              <li>React - фреймворк для создания интерфейса</li>
              <li>Create React App - инструмент для построения проекта</li>
              <li>Lucide React - библиотека иконок</li>
            </ul>
          </div>

          <div style={styles.infoBox}>
            <h4 style={{ fontWeight: 'bold', color: '#1e40af', marginBottom: '8px' }}>Лицензия</h4>
            <p style={{ fontSize: '14px', color: '#374151' }}>
              Это учебный проект, разработанный в образовательных целях.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{ ...styles.button, ...styles.buttonPrimary, marginTop: '24px', width: '100%' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonPrimaryHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = styles.buttonPrimary.backgroundColor}
        >
          Закрыть
        </button>
      </div>
    </div>
  )
}
