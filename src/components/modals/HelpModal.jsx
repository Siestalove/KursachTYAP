import React, { useState } from 'react'
import { X } from 'lucide-react'
import { styles } from '../../styles'

export default function HelpModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#374151' }}>Справка и помощь</h2>
          <button
            onClick={onClose}
            style={{ padding: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
          {[
            { id: 'overview', label: 'Обзор' },
            { id: 'format', label: 'Формат' },
            { id: 'examples', label: 'Примеры' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 16px',
                fontWeight: '600',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                borderBottom: activeTab === tab.id ? '2px solid #2563eb' : 'none',
                color: activeTab === tab.id ? '#2563eb' : '#6b7280',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) e.target.style.color = '#374151'
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) e.target.style.color = '#6b7280'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6', maxHeight: '400px', overflowY: 'auto' }}>
          {activeTab === 'overview' && (
            <div>
              <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>Что такое ДКА?</h3>
              <p style={{ marginBottom: '16px' }}>
                Детерминированный конечный автомат (ДКА) - это математическая модель распознавания языков.
                ДКА состоит из состояний, алфавита и правил переходов между состояниями.
              </p>

              <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>Как работает программа?</h3>
              <ol style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                <li>Введите параметры языка (алфавит, подцепочка, кратность)</li>
                <li>Система построит соответствующий ДКА</li>
                <li>Введите цепочку для проверки</li>
                <li>Программа покажет, принадлежит ли цепочка языку</li>
                <li>Экспортируйте результаты в файл</li>
              </ol>
            </div>
          )}

          {activeTab === 'format' && (
            <div>
              <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>Формат ввода - Алфавит</h3>
              <p style={{ marginBottom: '8px', fontStyle: 'italic' }}>Введите символы подряд без пробелов:</p>
              <p style={{ backgroundColor: '#f3f4f6', padding: '8px', borderRadius: '4px', marginBottom: '16px', fontFamily: 'monospace' }}>
                ✓ abc, 01, xyz
              </p>

              <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>Формат ввода - Подцепочка</h3>
              <p style={{ marginBottom: '8px', fontStyle: 'italic' }}>Введите последовательность символов из алфавита:</p>
              <p style={{ backgroundColor: '#f3f4f6', padding: '8px', borderRadius: '4px', marginBottom: '16px', fontFamily: 'monospace' }}>
                ✓ ab, 101, aa
              </p>

              <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>Формат ввода - Кратность</h3>
              <p style={{ marginBottom: '8px', fontStyle: 'italic' }}>Введите положительное целое число:</p>
              <p style={{ backgroundColor: '#f3f4f6', padding: '8px', borderRadius: '4px', marginBottom: '16px', fontFamily: 'monospace' }}>
                ✓ 1, 2, 3, 4
              </p>
            </div>
          )}

          {activeTab === 'examples' && (
            <div>
              <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>Пример 1: Язык чётной длины с подцепочкой "ab"</h3>
              <p style={{ backgroundColor: '#f0fdf4', padding: '8px', borderRadius: '4px', marginBottom: '16px', fontFamily: 'monospace' }}>
                Алфавит: ab<br/>
                Подцепочка: ab<br/>
                Кратность: 2<br/>
                Примеры: ab, abab, aabb, abba
              </p>

              <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>Пример 2: Язык с подцепочкой "aa"</h3>
              <p style={{ backgroundColor: '#f0fdf4', padding: '8px', borderRadius: '4px', marginBottom: '16px', fontFamily: 'monospace' }}>
                Алфавит: ab<br/>
                Подцепочка: aa<br/>
                Кратность: 1<br/>
                Примеры: aa, aaa, baa, aab, baab
              </p>
            </div>
          )}
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
