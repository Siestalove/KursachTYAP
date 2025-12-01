import React from 'react'
import { X } from 'lucide-react'
import { styles } from '../../styles'

export default function AboutModal({ onClose }) {
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#374151' }}>Автор</h2>
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
          <div style={{ fontSize: '16px', fontWeight: '600', lineHeight: '1.8' }}>
            Бурдинский Андрей Константинович
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
