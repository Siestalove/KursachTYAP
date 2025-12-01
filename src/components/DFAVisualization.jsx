import React from 'react'

export default function DFAVisualization({ dfa, viewMode }) {
  if (viewMode === 'table') {
    return <DFATable dfa={dfa} />
  } else {
    return <DFAGraph dfa={dfa} />
  }
}

function DFATable({ dfa }) {
  return (
    <div className="overflow-x-auto">
      <table className="dfa-table">
        <thead>
          <tr>
            <th>Состояние</th>
            {dfa.alphabet.map((symbol) => (
              <th key={symbol}>{symbol}</th>
            ))}
            <th>Тип</th>
          </tr>
        </thead>
        <tbody>
          {dfa.states.map((state) => (
            <tr key={state}>
              <td className={dfa.initialState === state ? 'state-initial' : ''}>
                {state}
                {dfa.initialState === state && ' (начальное)'}
              </td>
              {dfa.alphabet.map((symbol) => (
                <td key={`${state}-${symbol}`}>
                  {dfa.transitions[state]?.[symbol] || '-'}
                </td>
              ))}
              <td>
                {dfa.finalStates.includes(state) && (
                  <span className="state-final">Финальное</span>
                )}
                {dfa.initialState === state && dfa.finalStates.includes(state) && (
                  <span className="state-final">, Начальное</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-2">Легенда:</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• <span className="state-initial">Начальное состояние</span> - состояние, с которого начинается автомат</li>
          <li>• <span className="state-final">Финальное состояние</span> - состояние принятия (цепочка принята)</li>
          <li>• Таблица показывает переходы из каждого состояния по каждому символу алфавита</li>
        </ul>
      </div>
    </div>
  )
}

function DFAGraph({ dfa }) {
  const minWidth = 1400
  const minHeight = 900
  const padding = 120
  const stateRadius = 40
  const svgRef = React.useRef(null)

  // Функция для скачивания графа как PNG изображения
  const downloadGraphImage = () => {
    if (!svgRef.current) return

    try {
      // Получаем SVG элемент
      const svgElement = svgRef.current
      const serializer = new XMLSerializer()
      const svgString = serializer.serializeToString(svgElement)
      
      // Создаем canvas для конвертации в PNG
      const canvas = document.createElement('canvas')
      canvas.width = minWidth
      canvas.height = minHeight
      const ctx = canvas.getContext('2d')
      
      // Создаем Image из SVG
      const img = new Image()
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)
      
      img.onload = () => {
        // Рисуем на canvas
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, minWidth, minHeight)
        ctx.drawImage(img, 0, 0)
        
        // Конвертируем canvas в PNG и скачиваем
        canvas.toBlob((blob) => {
          const downloadUrl = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.download = 'dfa-graph.png'
          link.href = downloadUrl
          link.click()
          URL.revokeObjectURL(downloadUrl)
          URL.revokeObjectURL(url)
        }, 'image/png')
      }
      
      img.src = url
    } catch (error) {
      console.error('Ошибка при скачивании изображения:', error)
      alert('Произошла ошибка при скачивании изображения')
    }
  }

  const calculatePositions = () => {
    const positions = {}
    const n = dfa.states.length

    if (n === 0) return positions

    const cx = minWidth / 2
    const cy = minHeight / 2
    const radius = Math.min((minWidth - 2 * padding) / 2, (minHeight - 2 * padding) / 2)

    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2 // Смещение для лучшего расположения
      positions[dfa.states[i]] = {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      }
    }

    return positions
  }

  const positions = calculatePositions()

  // Собираем все переходы из таблицы (для ДКА - каждый переход уникален)
  const transitions = []
  
  for (const state of dfa.states) {
    for (const symbol of dfa.alphabet) {
      const nextState = dfa.transitions[state]?.[symbol]
      if (nextState) {
        transitions.push({
          from: state,
          to: nextState,
          symbol: symbol,
          isSelf: state === nextState,
          key: `${state}-${symbol}-${nextState}` // Уникальный ключ для каждого перехода
        })
      }
    }
  }

  // Группируем переходы для объединения меток (только если из одного состояния в одно и то же по разным символам)
  const groupTransitions = (transitions) => {
    const groups = new Map()
    
    transitions.forEach(trans => {
      // Ключ: направленная пара (from, to) - это важно для ДКА!
      const key = `${trans.from}->${trans.to}`
      
      if (!groups.has(key)) {
        groups.set(key, {
          from: trans.from,
          to: trans.to,
          isSelf: trans.isSelf,
          symbols: [],
          count: 0
        })
      }
      
      const group = groups.get(key)
      group.symbols.push(trans.symbol)
      group.count++
    })
    
    return Array.from(groups.values())
  }

  const transitionGroups = groupTransitions(transitions)

  // Отрисовка самоцикла
  const renderSelfLoop = (state, symbols, pos, loopIndex) => {
    const loopRadius = 50
    const angleOffset = (loopIndex * 60) % 360 // Распределяем самоциклы по углам
    
    // Позиция центра петли
    const angle = (angleOffset * Math.PI) / 180
    const loopX = pos.x + Math.cos(angle) * (stateRadius + loopRadius * 0.7)
    const loopY = pos.y + Math.sin(angle) * (stateRadius + loopRadius * 0.7)
    
    // Точки для кривой Безье
    const cp1X = loopX + Math.cos(angle + Math.PI/3) * loopRadius
    const cp1Y = loopY + Math.sin(angle + Math.PI/3) * loopRadius
    const cp2X = loopX + Math.cos(angle - Math.PI/3) * loopRadius
    const cp2Y = loopY + Math.sin(angle - Math.PI/3) * loopRadius
    
    return (
      <g key={`self-${state}-${loopIndex}`}>
        <path
          d={`M ${pos.x + Math.cos(angle) * stateRadius} ${pos.y + Math.sin(angle) * stateRadius}
              C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${pos.x + Math.cos(angle) * stateRadius} ${pos.y + Math.sin(angle) * stateRadius}`}
          stroke="#e91e63"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead-pink)"
        />
        
        {/* Подложка для текста */}
        <rect
          x={loopX - (symbols.join(',').length * 4 + 10)}
          y={loopY - 15}
          width={symbols.join(',').length * 8 + 20}
          height={22}
          fill="white"
          stroke="#f8bbd0"
          strokeWidth="1"
          rx="4"
          opacity="0.95"
        />
        
        {/* Текст символов */}
        <text
          x={loopX}
          y={loopY}
          textAnchor="middle"
          dy="0.3em"
          fontSize="11"
          fontWeight="600"
          fill="#c2185b"
        >
          {symbols.join(',')}
        </text>
      </g>
    )
  }

  return (
    <>
      {/* Кнопка скачивания */}
      <div style={{ 
        marginBottom: '16px', 
        display: 'flex', 
        justifyContent: 'flex-end',
        gap: '10px'
      }}>
        <button
          onClick={downloadGraphImage}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background-color 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#1976D2'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#2196F3'}
        >
          <span>📥</span>
          Скачать граф как изображение
        </button>
      </div>

      <div style={{ 
        overflowX: 'auto', 
        overflowY: 'auto', 
        maxHeight: '700px', 
        padding: '20px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '10px', 
        border: '1px solid #ddd' 
      }}>
        <svg 
          ref={svgRef}
          width={minWidth} 
          height={minHeight} 
          style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            display: 'block', 
            minWidth: minWidth, 
            minHeight: minHeight 
          }}
        >
          <defs>
            {/* Стрелка для переходов */}
            <marker
              id="arrowhead-blue"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#2196F3" />
            </marker>
            
            {/* Стрелка для самоциклов */}
            <marker
              id="arrowhead-pink"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#e91e63" />
            </marker>
            
            {/* Стрелка для начального состояния */}
            <marker
              id="initialArrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#1565C0" />
            </marker>
            
            {/* Градиент для состояний */}
            <linearGradient id="stateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bbdefb" />
              <stop offset="100%" stopColor="#e3f2fd" />
            </linearGradient>
          </defs>

        {/* Сначала рисуем все стрелки-переходы */}
        {transitionGroups.map((group, groupIndex) => {
          const { from, to, symbols, isSelf } = group
          const startPos = positions[from]
          const endPos = positions[to]

          if (!startPos || !endPos) return null

          if (isSelf) {
            // Отложим отрисовку самоциклов на потом
            return null
          }

          // Проверяем, есть ли обратный переход
          const hasBackward = transitionGroups.some(g => 
            g.from === to && g.to === from && !g.isSelf
          )
          
          // Рассчитываем точки касания кругов
          const dx = endPos.x - startPos.x
          const dy = endPos.y - startPos.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance === 0) return null
          
          const startOffsetX = (dx / distance) * stateRadius
          const startOffsetY = (dy / distance) * stateRadius
          const endOffsetX = (-dx / distance) * stateRadius
          const endOffsetY = (-dy / distance) * stateRadius
          
          const startX = startPos.x + startOffsetX
          const startY = startPos.y + startOffsetY
          const endX = endPos.x + endOffsetX
          const endY = endPos.y + endOffsetY
          
          // Если есть обратный переход, делаем изгиб
          const needsCurve = hasBackward
          const curveOffset = 40 // Величина изгиба
          const controlX = (startX + endX) / 2 + (-dy / distance) * curveOffset
          const controlY = (startY + endY) / 2 + (dx / distance) * curveOffset
          
          // Позиция метки
          let labelX, labelY
          if (needsCurve) {
            labelX = (startX + controlX + endX) / 3
            labelY = (startY + controlY + endY) / 3
          } else {
            labelX = (startX + endX) / 2
            labelY = (startY + endY) / 2
          }
          
          const arrowType = "url(#arrowhead-blue)"
          const lineColor = "#2196F3"

          return (
            <g key={`${from}-${to}-${groupIndex}`}>
              {/* Линия перехода */}
              {needsCurve ? (
                <path
                  d={`M ${startX} ${startY} Q ${controlX} ${controlY}, ${endX} ${endY}`}
                  stroke={lineColor}
                  strokeWidth="2"
                  fill="none"
                  markerEnd={arrowType}
                />
              ) : (
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke={lineColor}
                  strokeWidth="2"
                  markerEnd={arrowType}
                />
              )}
              
              {/* Фон для метки */}
              <rect
                x={labelX - (symbols.join(',').length * 4 + 10)}
                y={labelY - 12}
                width={symbols.join(',').length * 8 + 20}
                height={20}
                fill="white"
                stroke={lineColor}
                strokeWidth="1"
                rx="4"
                opacity="0.95"
              />
              
              {/* Текст символов */}
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dy="0.3em"
                fontSize="11"
                fontWeight="600"
                fill={lineColor}
              >
                {symbols.join(',')}
              </text>
            </g>
          )
        })}

        {/* Теперь рисуем самоциклы */}
        {transitionGroups
          .filter(group => group.isSelf)
          .map((group, index) => {
            const pos = positions[group.from]
            if (!pos) return null
            
            return renderSelfLoop(group.from, group.symbols, pos, index)
          })}

        {/* Рисуем состояния поверх всего */}
        {dfa.states.map((state) => {
          const pos = positions[state]
          if (!pos) return null

          const isFinal = dfa.finalStates.includes(state)
          const isInitial = state === dfa.initialState

          return (
            <g key={state}>
              {/* Двойной круг для финального состояния */}
              {isFinal && (
                <>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={stateRadius + 8}
                    fill="none"
                    stroke="#4CAF50"
                    strokeWidth="4"
                    opacity="0.8"
                  />
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={stateRadius + 4}
                    fill="none"
                    stroke="#4CAF50"
                    strokeWidth="2"
                  />
                </>
              )}

              {/* Основной круг состояния */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={stateRadius}
                fill={isInitial ? "url(#stateGradient)" : "#fafafa"}
                stroke={isInitial ? "#1565C0" : "#666"}
                strokeWidth={isInitial ? "3" : "2"}
              />

              {/* Стрелка для начального состояния */}
              {isInitial && (
                <>
                  <line
                    x1={pos.x - stateRadius - 40}
                    y1={pos.y}
                    x2={pos.x - stateRadius - 5}
                    y2={pos.y}
                    stroke="#1565C0"
                    strokeWidth="3"
                    markerEnd="url(#initialArrow)"
                  />
                  <circle
                    cx={pos.x - stateRadius - 45}
                    cy={pos.y}
                    r="4"
                    fill="#1565C0"
                  />
                </>
              )}

              {/* Текст состояния */}
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dy="0.3em"
                fontSize="14"
                fontWeight="bold"
                fill={isInitial ? "#0d47a1" : "#333"}
              >
                {state}
              </text>
              
              {/* Подсветка при наведении (интерактивность) */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={stateRadius + 5}
                fill="transparent"
                onMouseEnter={(e) => {
                  e.target.style.cursor = 'pointer'
                  // Можно добавить подсветку связанных переходов
                }}
              />
            </g>
          )
        })}
      </svg>
      </div>

      {/* Легенда обозначений под графом */}
      <div style={{ 
        marginTop: '24px', 
        padding: '20px', 
        backgroundColor: 'white', 
        borderRadius: '10px', 
        border: '1px solid #d1d5db',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h4 style={{ 
          fontWeight: 'bold', 
          color: '#1f2937', 
          marginBottom: '16px', 
          fontSize: '18px' 
        }}>
          Обозначения графа ДКА:
        </h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px' 
        }}>
          {/* Состояния */}
          <div>
            <h5 style={{ 
              fontWeight: '600', 
              color: '#374151', 
              marginBottom: '12px',
              fontSize: '14px'
            }}>
              Состояния:
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #bbdefb 0%, #e3f2fd 100%)',
                  border: '3px solid #1565C0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  color: '#0d47a1',
                  fontSize: '12px',
                  flexShrink: 0
                }}>
                  q0
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '13px', color: '#1f2937' }}>
                    Начальное состояние
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                    Синий круг со стрелкой слева
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative', width: '40px', height: '40px', flexShrink: 0 }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    backgroundColor: '#fafafa',
                    border: '2px solid #666',
                    position: 'absolute'
                  }}></div>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '50%',
                    border: '4px solid #4CAF50',
                    position: 'absolute',
                    top: '-4px',
                    left: '-4px',
                    opacity: 0.8
                  }}></div>
                  <div style={{ 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '50%',
                    border: '2px solid #4CAF50',
                    position: 'absolute',
                    top: '-2px',
                    left: '-2px'
                  }}></div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '13px', color: '#1f2937' }}>
                    Финальное (допускающее) состояние
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                    Двойной круг (зеленый контур)
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: '#fafafa',
                  border: '2px solid #666',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#333',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  q1
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '13px', color: '#1f2937' }}>
                    Обычное состояние
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                    Простой круг (серый контур)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}