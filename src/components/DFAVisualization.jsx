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

  // Собираем все переходы
  const transitions = []
  
  for (const state of dfa.states) {
    for (const symbol of dfa.alphabet) {
      const nextState = dfa.transitions[state]?.[symbol]
      if (nextState) {
        transitions.push({
          from: state,
          to: nextState,
          symbol: symbol,
          isSelf: state === nextState
        })
      }
    }
  }

  // Группируем переходы для отрисовки
  const groupTransitions = (transitions) => {
    const groups = new Map()
    
    transitions.forEach(trans => {
      const key = trans.isSelf ? `self-${trans.from}` : 
                 trans.from < trans.to ? `${trans.from}-${trans.to}` : `${trans.to}-${trans.from}`
      
      if (!groups.has(key)) {
        groups.set(key, {
          from: trans.from,
          to: trans.to,
          isSelf: trans.isSelf,
          symbols: new Set(),
          count: 0
        })
      }
      
      const group = groups.get(key)
      group.symbols.add(trans.symbol)
      group.count++
    })
    
    return Array.from(groups.values()).map(group => ({
      ...group,
      symbols: Array.from(group.symbols)
    }))
  }

  const transitionGroups = groupTransitions(transitions)

  // Расчет позиции для метки перехода
  const calculateLabelPosition = (startPos, endPos, groupIndex, totalGroups) => {
    const midX = (startPos.x + endPos.x) / 2
    const midY = (startPos.y + endPos.y) / 2
    
    const dx = endPos.x - startPos.x
    const dy = endPos.y - startPos.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance === 0) return { x: midX, y: midY, angle: 0 }
    
    // Смещаем метки для разных переходов между одинаковыми состояниями
    const offsetDistance = 30 + (groupIndex * 25)
    const offsetX = (-dy / distance) * offsetDistance
    const offsetY = (dx / distance) * offsetDistance
    
    const angle = Math.atan2(dy, dx) * 180 / Math.PI
    
    return {
      x: midX + offsetX,
      y: midY + offsetY,
      angle: Math.abs(angle) > 90 ? angle + 180 : angle
    }
  }

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
          {/* Стрелка для обычных переходов */}
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
          
          {/* Стрелка для обратных переходов */}
          <marker
            id="arrowhead-green"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#4CAF50" />
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

          const { x, y, angle } = calculateLabelPosition(
            startPos, 
            endPos, 
            groupIndex, 
            transitionGroups.length
          )
          
          const isReverse = groupIndex > 0 && from < to
          const arrowType = isReverse ? "url(#arrowhead-green)" : "url(#arrowhead-blue)"
          const lineColor = isReverse ? "#4CAF50" : "#2196F3"
          
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
          
          // Кривая для обратных переходов
          const controlX = (startX + endX) / 2 + (-dy / distance) * 40
          const controlY = (startY + endY) / 2 + (dx / distance) * 40

          return (
            <g key={`${from}-${to}-${groupIndex}`}>
              {/* Линия перехода */}
              {isReverse ? (
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
                x={x - (symbols.join(',').length * 4 + 10)}
                y={y - 12}
                width={symbols.join(',').length * 8 + 20}
                height={20}
                fill="white"
                stroke={lineColor}
                strokeWidth="1"
                rx="4"
                opacity="0.95"
              />
              
              {/* Соединительная линия от метки к стрелке */}
              <line
                x1={x}
                y1={y}
                x2={isReverse ? controlX : (startX + endX) / 2}
                y2={isReverse ? controlY : (startY + endY) / 2}
                stroke={lineColor}
                strokeWidth="1"
                strokeDasharray="3,3"
                opacity="0.6"
              />
              
              {/* Текст символов */}
              <text
                x={x}
                y={y}
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

      {/* Улучшенная легенда */}
      <div className="ml-8 p-6 bg-white rounded-lg border border-gray-300 shadow-sm max-w-md">
        <h4 className="font-bold text-gray-900 mb-4 text-lg">Обозначения графа ДКА:</h4>
        <ul className="text-sm text-gray-800 space-y-4">
          <li className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 border-3 border-blue-700 flex items-center justify-center">
              <span className="text-blue-800 font-bold">Q</span>
            </div>
            <div>
              <span className="font-semibold">Начальное состояние</span>
              <div className="text-xs text-gray-600">Автомат начинает работу с этого состояния</div>
            </div>
          </li>
          <li className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <div className="w-8 h-8 rounded-full bg-gray-50 border-2 border-gray-600"></div>
              <div className="absolute inset-0 rounded-full border-2 border-green-500" style={{margin: '4px'}}></div>
            </div>
            <div>
              <span className="font-semibold">Финальное состояние</span>
              <div className="text-xs text-gray-600">Цепочка принимается в этом состоянии</div>
            </div>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-50 border-2 border-gray-600"></div>
            <div>
              <span className="font-semibold">Обычное состояние</span>
              <div className="text-xs text-gray-600">Промежуточное состояние автомата</div>
            </div>
          </li>
          <li className="border-t pt-4">
            <h5 className="font-semibold text-gray-900 mb-2">Переходы:</h5>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-blue-500"></div>
                <div className="w-2 h-2 transform rotate-45 bg-blue-500"></div>
                <span className="text-xs font-medium text-blue-700">Прямой переход</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="40" height="20">
                  <path d="M5,10 Q20,0 35,10" stroke="#4CAF50" fill="none" strokeWidth="2"/>
                  <polygon points="33,8 35,10 33,12" fill="#4CAF50"/>
                </svg>
                <span className="text-xs font-medium text-green-700">Обратный переход</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="40" height="40">
                  <path d="M20,10 C30,5 30,15 20,10" stroke="#e91e63" fill="none" strokeWidth="2"/>
                  <polygon points="18,8 20,10 18,12" fill="#e91e63"/>
                </svg>
                <span className="text-xs font-medium text-pink-700">Самоцикл</span>
              </div>
            </div>
          </li>
          <li className="text-xs text-gray-600 border-t pt-4">
            • <span className="font-medium">Символы через запятую</span> показывают, по каким символам осуществляется переход
            <br/>• <span className="font-medium">Пунктирные линии</span> соединяют метки с соответствующими переходами
            <br/>• <span className="font-medium">Разные цвета</span> помогают различать типы переходов
          </li>
        </ul>
      </div>
    </div>
  )
}