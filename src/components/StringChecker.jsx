import React, { useState } from 'react'
import { Play, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

export default function StringChecker({ dfa, checkResults, setCheckResults }) {
  const [inputString, setInputString] = useState('')
  const [error, setError] = useState('')
  const [expandedResult, setExpandedResult] = useState(null)

  const checkString = () => {
    setError('')

    if (!inputString.trim()) {
      setError('Пожалуйста, введите цепочку для проверки')
      return
    }

    const chars = inputString.split('')
    const alphabetSet = new Set(dfa.alphabet)

    for (let char of chars) {
      if (!alphabetSet.has(char)) {
        setError(`Символ "${char}" не принадлежит алфавиту`)
        return
      }
    }

    if (dfa.multiplicity && inputString.length % dfa.multiplicity !== 0) {
      const result = {
        string: inputString,
        accepted: false,
        reason: `Длина цепочки (${inputString.length}) не кратна ${dfa.multiplicity}`,
        steps: [],
        timestamp: new Date().toLocaleTimeString('ru-RU'),
      }
      setCheckResults([result, ...checkResults])
      setInputString('')
      return
    }

    if (!inputString.includes(dfa.substring)) {
      const result = {
        string: inputString,
        accepted: false,
        reason: `Цепочка не содержит обязательную подцепочку "${dfa.substring}"`,
        steps: [],
        timestamp: new Date().toLocaleTimeString('ru-RU'),
      }
      setCheckResults([result, ...checkResults])
      setInputString('')
      return
    }

    const steps = []
    let currentState = dfa.initialState
    steps.push({
      step: 0,
      symbol: '-',
      nextState: currentState,
      description: `Начальное состояние: ${currentState}`,
    })

    for (let i = 0; i < chars.length; i++) {
      const symbol = chars[i]
      const nextState = dfa.transitions[currentState]?.[symbol]

      if (!nextState) {
        const result = {
          string: inputString,
          accepted: false,
          reason: `Нет перехода из состояния ${currentState} по символу "${symbol}"`,
          steps,
          timestamp: new Date().toLocaleTimeString('ru-RU'),
        }
        setCheckResults([result, ...checkResults])
        setInputString('')
        return
      }

      const isFinal = dfa.finalStates.includes(nextState)
      steps.push({
        step: i + 1,
        symbol,
        nextState,
        description: `Символ "${symbol}": ${currentState} → ${nextState}${isFinal ? ' (финальное)' : ''}`,
      })

      currentState = nextState
    }

    const accepted = dfa.finalStates.includes(currentState)
    const result = {
      string: inputString,
      accepted,
      reason: accepted
        ? `Цепочка принята. Финальное состояние: ${currentState}`
        : `Цепочка не принята. Финальное состояние: ${currentState} (не финальное)`,
      steps,
      timestamp: new Date().toLocaleTimeString('ru-RU'),
    }

    setCheckResults([result, ...checkResults])
    setInputString('')
  }

  const clearResults = () => {
    setCheckResults([])
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Проверка цепочек</h3>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Введите цепочку для проверки
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputString}
            onChange={(e) => setInputString(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') checkString()
            }}
            placeholder="Пример: abab"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={checkString}
            className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            <Play size={20} />
            <span>Проверить</span>
          </button>
        </div>

        {error && <div className="error-message mt-3">{error}</div>}

        <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
          <p className="text-sm text-gray-700">
            <strong>Параметры языка:</strong>
          </p>
          <ul className="mt-2 text-sm text-gray-600 space-y-1">
            <li>• Алфавит: <code className="bg-gray-200 px-2 py-1 rounded">{dfa.alphabet.join('')}</code></li>
            <li>• Обязательная подцепочка: <code className="bg-gray-200 px-2 py-1 rounded">{dfa.substring}</code></li>
            <li>• Кратность: <code className="bg-gray-200 px-2 py-1 rounded">{dfa.multiplicity}</code></li>
          </ul>
        </div>
      </div>

      {checkResults.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold text-gray-800">
              Результаты проверки ({checkResults.length})
            </h4>
            <button
              onClick={clearResults}
              className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm"
            >
              <Trash2 size={18} />
              <span>Очистить</span>
            </button>
          </div>

          <div className="space-y-4">
            {checkResults.map((result, index) => (
              <div
                key={index}
                className={`border rounded-lg overflow-hidden transition ${
                  result.accepted
                    ? 'border-green-300 bg-green-50'
                    : 'border-red-300 bg-red-50'
                }`}
              >
                <button
                  onClick={() => setExpandedResult(expandedResult === index ? null : index)}
                  className="w-full p-4 flex justify-between items-center hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        result.accepted ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    ></div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">
                        Цепочка: <code className="bg-gray-300 px-2 py-1 rounded">{result.string}</code>
                      </p>
                      <p className="text-sm text-gray-600">{result.timestamp}</p>
                    </div>
                    <div className="ml-auto">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          result.accepted
                            ? 'bg-green-200 text-green-800'
                            : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {result.accepted ? 'ПРИНЯТА' : 'ОТКЛОНЕНА'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    {expandedResult === index ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </div>
                </button>

                {expandedResult === index && (
                  <div className="border-t p-4 bg-white">
                    <p className="mb-4 text-sm font-semibold text-gray-700">
                      {result.reason}
                    </p>

                    {result.steps.length > 0 && (
                      <div>
                        <p className="mb-3 font-semibold text-gray-700">Пошаговое выполнение:</p>
                        <div className="space-y-2">
                          {result.steps.map((step, i) => (
                            <div
                              key={i}
                              className="p-2 bg-gray-50 rounded border border-gray-200 text-sm"
                            >
                              <span className="font-mono text-gray-600">
                                {step.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
