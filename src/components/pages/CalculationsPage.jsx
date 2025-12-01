import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react'
import StringChecker from '../StringChecker'
import DFAVisualization from '../DFAVisualization'
import { styles } from '../../styles'

export default function CalculationsPage() {
  const [dfa, setDfa] = useState(null)
  const [alphabet, setAlphabet] = useState('')
  const [substring, setSubstring] = useState('')
  const [multiplicity, setMultiplicity] = useState(1)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [viewMode, setViewMode] = useState('table')
  const [checkResults, setCheckResults] = useState([])

  // Загружаем данные из localStorage при монтировании компонента
  useEffect(() => {
    const savedDFAData = localStorage.getItem('dfa_data')
    if (savedDFAData) {
      try {
        const data = JSON.parse(savedDFAData)
        setDfa(data.dfa)
        setAlphabet(data.alphabet)
        setSubstring(data.substring)
        setMultiplicity(data.multiplicity)
        setCheckResults(data.checkResults || [])
      } catch (err) {
        console.error('Ошибка загрузки данных:', err)
      }
    }
  }, [])

  // Сохраняем данные в localStorage при изменении DFA или results
  useEffect(() => {
    if (dfa) {
      const dataToSave = {
        dfa,
        alphabet,
        substring,
        multiplicity,
        checkResults,
      }
      localStorage.setItem('dfa_data', JSON.stringify(dataToSave))
    }
  }, [dfa, checkResults, alphabet, substring, multiplicity])

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
    localStorage.removeItem('dfa_data')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={styles.card}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#374151', marginBottom: '24px' }}>Построение ДКА</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Алфавит <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              value={alphabet}
              onChange={(e) => setAlphabet(e.target.value)}
              placeholder="Пример: abc или 01"
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => { e.target.style.outline = 'none'; e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none' }}
            />
            <p style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
              Введите символы алфавита без пробелов между ними
            </p>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Обязательная подцепочка <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              value={substring}
              onChange={(e) => setSubstring(e.target.value)}
              placeholder="Пример: ab или 10"
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => { e.target.style.outline = 'none'; e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none' }}
            />
            <p style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
              Подцепочка, которая должна присутствовать в цепочках языка
            </p>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Кратность длины <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="number"
              value={multiplicity}
              onChange={(e) => setMultiplicity(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => { e.target.style.outline = 'none'; e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none' }}
            />
            <p style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
              Длина цепочки должна быть кратна этому числу
            </p>
          </div>
        </div>

        {error && <div style={styles.errorMessage}>{error}</div>}
        {success && <div style={styles.successMessage}>{success}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button
            onClick={handleBuildDFA}
            style={{ ...styles.button, ...styles.buttonPrimary, width: '100%' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonPrimaryHover.backgroundColor}
            onMouseLeave={(e) => e.target.style.backgroundColor = styles.buttonPrimary.backgroundColor}
          >
            <Plus size={20} />
            <span>Построить ДКА</span>
          </button>
          <button
            onClick={handleClear}
            style={{ ...styles.button, ...styles.buttonSecondary, width: '100%' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonSecondaryHover.backgroundColor}
            onMouseLeave={(e) => e.target.style.backgroundColor = styles.buttonSecondary.backgroundColor}
          >
            <Trash2 size={20} />
            <span>Очистить</span>
          </button>
        </div>
      </div>

      {dfa && (
        <>
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#374151' }}>Функция переходов</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setViewMode('table')}
                  style={{
                    ...styles.button,
                    ...(viewMode === 'table' ? styles.buttonPrimary : styles.buttonSecondary)
                  }}
                  onMouseEnter={(e) => {
                    if (viewMode !== 'table') e.target.style.backgroundColor = styles.buttonSecondaryHover.backgroundColor
                  }}
                  onMouseLeave={(e) => {
                    if (viewMode !== 'table') e.target.style.backgroundColor = styles.buttonSecondary.backgroundColor
                  }}
                >
                  <Eye size={18} />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Таблица</span>
                </button>
                <button
                  onClick={() => setViewMode('graph')}
                  style={{
                    ...styles.button,
                    ...(viewMode === 'graph' ? styles.buttonPrimary : styles.buttonSecondary)
                  }}
                  onMouseEnter={(e) => {
                    if (viewMode !== 'graph') e.target.style.backgroundColor = styles.buttonSecondaryHover.backgroundColor
                  }}
                  onMouseLeave={(e) => {
                    if (viewMode !== 'graph') e.target.style.backgroundColor = styles.buttonSecondary.backgroundColor
                  }}
                >
                  <EyeOff size={18} />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Граф</span>
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
