import React, { useState } from 'react'
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react'
import DFABuilder from '../DFABuilder'
import StringChecker from '../StringChecker'
import DFAVisualization from '../DFAVisualization'

export default function CalculationsPage() {
  const [dfa, setDfa] = useState(null)
  const [alphabet, setAlphabet] = useState('')
  const [substring, setSubstring] = useState('')
  const [multiplicity, setMultiplicity] = useState(1)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [viewMode, setViewMode] = useState('table')
  const [checkResults, setCheckResults] = useState([])

  const handleBuildDFA = () => {
    setError('')
    setSuccess('')
    setCheckResults([])

    if (!alphabet.trim()) {
      setError('Алфавит не может быть пустым')
      return
    }

    if (alphabet.length === 1 && alphabet === ' ') {
      setError('Алфавит не может содержать только пробелы')
      return
    }

    if (!substring.trim()) {
      setError('Обязательная подцепочка не может быть пустой')
      return
    }

    const alphabetSet = new Set(alphabet.split(''))
    const substringChars = substring.split('')

    for (let char of substringChars) {
      if (!alphabetSet.has(char)) {
        setError(`Символ "${char}" из подцепочки не находится в алфавите`)
        return
      }
    }

    if (multiplicity < 1 || !Number.isInteger(multiplicity)) {
      setError('Кратность должна быть положительным целым числом')
      return
    }

    try {
      const newDFA = buildDFA(alphabet, substring, multiplicity)
      setDfa(newDFA)
      setSuccess('ДКА успешно построен!')
    } catch (err) {
      setError(`Ошибка при построении ДКА: ${err.message}`)
    }
  }

  const handleClear = () => {
    setAlphabet('')
    setSubstring('')
    setMultiplicity(1)
    setDfa(null)
    setError('')
    setSuccess('')
    setCheckResults([])
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Построение ДКА</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Алфавит <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={alphabet}
              onChange={(e) => setAlphabet(e.target.value)}
              placeholder="Пример: abc или 01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-2 text-xs text-gray-500">
              Введите символы алфавита без пробелов между ними
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Обязательная подцепочка <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={substring}
              onChange={(e) => setSubstring(e.target.value)}
              placeholder="Пример: ab или 10"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-2 text-xs text-gray-500">
              Подцепочка, которая должна присутствовать в цепочках языка
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Кратность длины <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={multiplicity}
              onChange={(e) => setMultiplicity(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-2 text-xs text-gray-500">
              Длина цепочки должна быть кратна этому числу
            </p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleBuildDFA}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            <Plus size={20} />
            <span>Построить ДКА</span>
          </button>
          <button
            onClick={handleClear}
            className="flex items-center justify-center space-x-2 bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition font-semibold"
          >
            <Trash2 size={20} />
            <span>Очистить</span>
          </button>
        </div>
      </div>

      {dfa && (
        <>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Функция переходов</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                    viewMode === 'table'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Eye size={18} />
                  <span className="text-sm font-medium">Таблица</span>
                </button>
                <button
                  onClick={() => setViewMode('graph')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                    viewMode === 'graph'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <EyeOff size={18} />
                  <span className="text-sm font-medium">Граф</span>
                </button>
              </div>
            </div>

            <DFAVisualization dfa={dfa} viewMode={viewMode} />
          </div>

          <StringChecker dfa={dfa} checkResults={checkResults} setCheckResults={setCheckResults} />
        </>
      )}
    </div>
  )
}

function buildDFA(alphabet, substring, multiplicity) {
  const states = new Set()
  const transitions = {}

  const alphabetArray = alphabet.split('')
  const substringArray = substring.split('')

  let stateId = 0
  const initialState = `q${stateId}`
  states.add(initialState)
  stateId++

  const stateMap = new Map()
  stateMap.set('', initialState)

  const getOrCreateState = (prefixMatch) => {
    if (stateMap.has(prefixMatch)) {
      return stateMap.get(prefixMatch)
    }
    const newState = `q${stateId++}`
    states.add(newState)
    stateMap.set(prefixMatch, newState)
    return newState
  }

  const isMatch = (prefix) => {
    if (prefix.length < substringArray.length) return false
    for (let i = 0; i < substringArray.length; i++) {
      if (prefix[prefix.length - substringArray.length + i] !== substringArray[i]) {
        return false
      }
    }
    return true
  }

  const computePrefix = (str) => {
    for (let i = Math.min(str.length, substringArray.length - 1); i > 0; i--) {
      let match = true
      for (let j = 0; j < i; j++) {
        if (str[str.length - i + j] !== substringArray[j]) {
          match = false
          break
        }
      }
      if (match) return str.slice(-i)
    }
    return ''
  }

  for (const state of states) {
    transitions[state] = {}
    for (const symbol of alphabetArray) {
      const prefix = stateMap.entries().find(([_, s]) => s === state)?.[0] || ''
      const newPrefix = isMatch(prefix + symbol) ? substring : computePrefix(prefix + symbol)
      const nextState = getOrCreateState(newPrefix)
      transitions[state][symbol] = nextState
    }
  }

  const expandStates = () => {
    let maxStates = 10
    let iteration = 0
    while (states.size < maxStates && iteration < 20) {
      const statesToProcess = Array.from(states).slice()
      for (const state of statesToProcess) {
        for (const symbol of alphabetArray) {
          const nextState = transitions[state]?.[symbol]
          if (nextState && !states.has(nextState)) {
            states.add(nextState)
            transitions[nextState] = {}
          }
        }
      }
      iteration++
    }
  }

  expandStates()

  for (const state of states) {
    if (!transitions[state]) {
      transitions[state] = {}
      for (const symbol of alphabetArray) {
        transitions[state][symbol] = initialState
      }
    }
    for (const symbol of alphabetArray) {
      if (!transitions[state][symbol]) {
        transitions[state][symbol] = initialState
      }
    }
  }

  const finalStates = new Set()
  for (const state of states) {
    const prefix = stateMap.entries().find(([_, s]) => s === state)?.[0] || ''
    if (prefix === substring) {
      finalStates.add(state)
    }
  }

  if (finalStates.size === 0) {
    const finalState = `q${stateId}`
    states.add(finalState)
    finalStates.add(finalState)
    for (const symbol of alphabetArray) {
      transitions[finalState] = transitions[finalState] || {}
      transitions[finalState][symbol] = finalState
    }
  }

  return {
    states: Array.from(states),
    alphabet: alphabetArray,
    initialState,
    finalStates: Array.from(finalStates),
    transitions,
    substring,
    multiplicity,
  }
}
