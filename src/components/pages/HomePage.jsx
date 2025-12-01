import React from 'react'
import { Zap, BookOpen, Network } from 'lucide-react'
import { styles } from '../../styles'

export default function HomePage() {
  return (
    <div style={{ paddingBottom: '32px' }}>
      <div style={{ ...styles.card, marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb', marginBottom: '16px' }}>
          Конструктор ДКА
        </h1>
        <p style={{ color: '#374151', fontSize: '18px', marginBottom: '24px' }}>
          Построение Детерминированного Конечного Автомата по описанию языка
        </p>
      </div>

      <div style={styles.grid}>
        <div style={{ ...styles.card, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', transition: 'box-shadow 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', backgroundColor: '#dbeafe', borderRadius: '8px', marginBottom: '16px' }}>
            <Network color="#2563eb" size={24} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Построение ДКА</h3>
          <p style={{ color: '#6b7280', marginBottom: '12px' }}>
            Создайте детерминированный конечный автомат на основе:
          </p>
          <ul style={{ marginTop: '12px', fontSize: '14px', color: '#6b7280', paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>Алфавита</li>
            <li>Обязательной подцепочки</li>
            <li>Кратности длины цепочек</li>
          </ul>
        </div>

        <div style={{ ...styles.card, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', transition: 'box-shadow 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', backgroundColor: '#dcfce7', borderRadius: '8px', marginBottom: '16px' }}>
            <Zap color='#16a34a' size={24} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Проверка Цепочек</h3>
          <p style={{ color: '#6b7280', marginBottom: '12px' }}>
            Проверьте принадлежность введённых цепочек к языку с пошаговым отображением процесса.
          </p>
        </div>

        <div style={{ ...styles.card, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', transition: 'box-shadow 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', backgroundColor: '#f3e8ff', borderRadius: '8px', marginBottom: '16px' }}>
            <BookOpen color='#9333ea' size={24} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Визуализация</h3>
          <p style={{ color: '#6b7280', marginBottom: '12px' }}>
            Просмотрите функцию переходов в виде таблицы или графа.
          </p>
        </div>
      </div>

      <div style={styles.infoBox}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e40af', marginBottom: '12px' }}>Начало работы:</h3>
        <ol style={{ paddingLeft: '20px', lineHeight: '1.8', color: '#374151' }}>
          <li>Перейдите в раздел <strong>"Расчёты"</strong> для построения ДКА</li>
          <li>Введите параметры языка (алфавит, подцепочка, кратность)</li>
          <li>Система автоматически построит автомат</li>
          <li>Проверьте цепочки на принадлежность языку</li>
          <li>Экспортируйте результаты в файл через <strong>"Запись результатов"</strong></li>
        </ol>
      </div>
    </div>
  )
}
