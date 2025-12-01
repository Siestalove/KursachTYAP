import React from 'react'
import { styles } from '../styles'

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
  const width = 800
  const height = 600
  const padding = 50
  const stateRadius = 30

  const calculatePositions = () => {
    const positions = {}
    const n = dfa.states.length

    if (n === 0) return positions

    const cx = width / 2
    const cy = height / 2
    const radius = Math.min((width - 2 * padding) / 2, (height - 2 * padding) / 2)

    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI * i) / n
      positions[dfa.states[i]] = {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      }
    }

    return positions
  }

  const positions = calculatePositions()

  const drawArrowHead = (x1, y1, x2, y2) => {
    const angle = Math.atan2(y2 - y1, x2 - x1)
    const size = 12

    return {
      points: [
        [x2, y2],
        [x2 - size * Math.cos(angle - Math.PI / 6), y2 - size * Math.sin(angle - Math.PI / 6)],
        [x2 - size * Math.cos(angle + Math.PI / 6), y2 - size * Math.sin(angle + Math.PI / 6)],
      ],
    }
  }

  const lines = []
  const edges = new Map()

  for (const state of dfa.states) {
    for (const symbol of dfa.alphabet) {
      const nextState = dfa.transitions[state]?.[symbol]
      if (nextState) {
        const edgeKey =
          state === nextState
            ? `self-${state}-${symbol}`
            : state < nextState
              ? `${state}-${nextState}-${symbol}`
              : `${nextState}-${state}-${symbol}`

        if (!edges.has(edgeKey)) {
          edges.set(edgeKey, [])
        }
        edges.get(edgeKey).push(symbol)
      }
    }
  }

  const getLineAttributes = (from, to, edgeIndex, totalEdges) => {
    if (from === to) {
      return {
        type: 'curve',
        curveDir: edgeIndex % 2 === 0 ? 1 : -1,
      }
    }

    const offset = (edgeIndex - Math.floor(totalEdges / 2)) * 0.15
    return {
      type: 'line',
      offset,
    }
  }

  return (
    <div className="flex justify-center items-center p-4 bg-gray-50 rounded border border-gray-200 overflow-auto">
      <svg width={width} height={height} className="border border-gray-300 bg-white rounded">
        {/* Рисуем переходы (дуги) */}
        {Array.from(edges.entries()).map(([edgeKey, symbols], index) => {
          const parts = edgeKey.split('-')
          const isSelf = edgeKey.startsWith('self-')
          const from = isSelf ? parts[1] : parts[0]
          const to = isSelf ? parts[1] : parts[1]

          const startPos = positions[from]
          const endPos = positions[to]

          if (!startPos || !endPos) return null

          if (isSelf) {
            const loopX = startPos.x
            const loopY = startPos.y - 60
            const loopRadius = 40

            return (
              <g key={edgeKey}>
                <path
                  d={`M ${startPos.x} ${startPos.y - stateRadius} Q ${loopX - loopRadius} ${loopY - loopRadius}, ${loopX} ${loopY} Q ${loopX + loopRadius} ${loopY - loopRadius}, ${startPos.x} ${startPos.y - stateRadius}`}
                  stroke="#666"
                  strokeWidth="2"
                  fill="none"
                />
                <text
                  x={loopX}
                  y={loopY - 50}
                  textAnchor="middle"
                  className="text-xs font-semibold"
                  fill="#333"
                >
                  {symbols.join(',')}
                </text>
              </g>
            )
          } else {
            const midX = (startPos.x + endPos.x) / 2
            const midY = (startPos.y + endPos.y) / 2

            const dx = endPos.x - startPos.x
            const dy = endPos.y - startPos.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            const offsetX = (-dy / distance) * 15
            const offsetY = (dx / distance) * 15

            const labelX = midX + offsetX
            const labelY = midY + offsetY

            return (
              <g key={edgeKey}>
                <line
                  x1={startPos.x}
                  y1={startPos.y}
                  x2={endPos.x}
                  y2={endPos.y}
                  stroke="#666"
                  strokeWidth="2"
                />
                <defs>
                  <marker
                    id={`arrowhead-${index}`}
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3, 0 6" fill="#666" />
                  </marker>
                </defs>
                <line
                  x1={startPos.x}
                  y1={startPos.y}
                  x2={endPos.x}
                  y2={endPos.y}
                  stroke="#666"
                  strokeWidth="2"
                  markerEnd={`url(#arrowhead-${index})`}
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  className="text-xs font-semibold bg-white px-1"
                  fill="#333"
                >
                  {symbols.join(',')}
                </text>
              </g>
            )
          }
        })}

        {/* Рисуем состояния */}
        {dfa.states.map((state) => {
          const pos = positions[state]
          if (!pos) return null

          const isFinal = dfa.finalStates.includes(state)
          const isInitial = state === dfa.initialState

          return (
            <g key={state}>
              {/* Внешний круг для финального состояния */}
              {isFinal && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={stateRadius + 6}
                  fill="none"
                  stroke="#4CAF50"
                  strokeWidth="3"
                />
              )}

              {/* Основной круг состояния */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={stateRadius}
                fill={isInitial ? '#2196F3' : '#fff'}
                stroke={isInitial ? '#2196F3' : '#333'}
                strokeWidth="2"
              />

              {/* Стрелка для начального состояния */}
              {isInitial && (
                <g>
                  <line
                    x1={pos.x - stateRadius - 30}
                    y1={pos.y}
                    x2={pos.x - stateRadius - 5}
                    y2={pos.y}
                    stroke="#2196F3"
                    strokeWidth="2"
                    markerEnd="url(#initialArrow)"
                  />
                  <defs>
                    <marker
                      id="initialArrow"
                      markerWidth="10"
                      markerHeight="10"
                      refX="9"
                      refY="3"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3, 0 6" fill="#2196F3" />
                    </marker>
                  </defs>
                </g>
              )}

              {/* Текст состояния */}
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dy="0.3em"
                className="text-sm font-bold"
                fill={isInitial ? '#fff' : '#333'}
              >
                {state}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="ml-8 p-4 bg-white rounded border border-gray-200 max-w-xs">
        <h4 className="font-bold text-gray-800 mb-2">Обозначения:</h4>
        <ul className="text-xs text-gray-700 space-y-2">
          <li className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white border-2 border-blue-500" />
            Начальное состояние
          </li>
          <li className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-800" />
            <div className="w-2 h-2 rounded-full border-2 border-green-500" style={{margin: '0 2px'}} />
            Финальное состояние
          </li>
          <li className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-800" />
            Обычное состояние
          </li>
        </ul>
      </div>
    </div>
  )
}
