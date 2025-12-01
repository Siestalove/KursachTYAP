import React from 'react'
import { X } from 'lucide-react'
import { styles } from '../../styles'

export default function ThemeModal({ onClose }) {
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#374151' }}>Тема курсовой работы</h2>
          <button
            onClick={onClose}
            style={{ padding: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', color: '#374151', fontSize: '14px' }}>
          <div>
            <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>Тема 1: Построение конструкций, задающих язык</h3>
            <p style={{ lineHeight: '1.6' }}>
              Написать программу, которая по предложенному описанию языка построит детерминированный конечный автомат,
              распознающий этот язык, и проверит вводимые с клавиатуры цепочки на их принадлежность языку.
            </p>
          </div>

          <div>
            <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>Вариант задания</h3>
            <p style={{ fontWeight: '600', color: '#2563eb', marginBottom: '8px' }}>
              Язык задается следующими параметрами:
            </p>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              <li><strong>Алфавит</strong> - набор символов, из которых состоят цепочки языка</li>
              <li><strong>Обязательная фиксированная подцепочка</strong> - последовательность символов, которая должна присутствовать в каждой цепочке</li>
              <li><strong>Кратность длины цепочек</strong> - длина всех цепочек языка должна быть кратна этому числу</li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>Требования к программе</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              <li>Наличие графического интерфейса</li>
              <li>Меню с основными функциями</li>
              <li>Форма для ввода данных</li>
              <li>Справка с примерами</li>
              <li>Пошаговое отображение процесса проверки</li>
              <li>Экспорт результатов</li>
            </ul>
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
