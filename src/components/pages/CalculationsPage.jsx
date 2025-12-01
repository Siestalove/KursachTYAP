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
  const alphabetArray = alphabet.split('')
  const substringArray = substring.split('')
  const substringLen = substringArray.length
  
  // Состояния представлены как (prefixLen, lengthMod)
  // prefixLen: сколько символов подстроки совпадает с концом текущей строки (0...substringLen)
  // lengthMod: остаток от деления длины строки на multiplicity (0...multiplicity-1)
  const states = new Set()
  const transitions = {}
  const stateMap = new Map()
  
  let stateId = 0
  
  // Создание или получение состояния
  const getOrCreateState = (prefixLen, lengthMod) => {
    const key = `${prefixLen},${lengthMod}`
    if (stateMap.has(key)) {
      return stateMap.get(key)
    }
    const stateName = `q${stateId++}`
    states.add(stateName)
    stateMap.set(key, stateName)
    return stateName
  }
  
  // Функция отката (failure function) - определяет новый префикс после добавления символа
  const computeNextPrefix = (currentPrefixLen, symbol) => {
    // Пробуем добавить символ к текущему префиксу
    let testLen = currentPrefixLen
    while (testLen > 0) {
      if (substringArray[testLen] === symbol) {
        return testLen + 1
      }
      // Откатываемся назад
      testLen = computeFailure(testLen)
    }
    // Проверяем, совпадает ли символ с началом подстроки
    return substringArray[0] === symbol ? 1 : 0
  }
  
  // Вычисление failure function для KMP-подобного алгоритма
  const computeFailure = (len) => {
    for (let k = len - 1; k > 0; k--) {
      let match = true
      for (let i = 0; i < k; i++) {
        if (substringArray[i] !== substringArray[len - k + i]) {
          match = false
          break
        }
      }
      if (match) return k
    }
    return 0
  }
  
  // Начальное состояние: префикс длины 0, длина строки 0 mod multiplicity
  const initialState = getOrCreateState(0, 0)
  
  // Построение всех состояний и переходов
  // Нам нужно обработать все комбинации (prefixLen, lengthMod)
  for (let prefixLen = 0; prefixLen <= substringLen; prefixLen++) {
    for (let lengthMod = 0; lengthMod < multiplicity; lengthMod++) {
      const currentState = getOrCreateState(prefixLen, lengthMod)
      transitions[currentState] = {}
      
      for (const symbol of alphabetArray) {
        let newPrefixLen
        
        if (prefixLen === substringLen) {
          // Уже нашли подстроку, продолжаем искать новые вхождения
          newPrefixLen = computeNextPrefix(substringLen - 1, symbol)
        } else if (substringArray[prefixLen] === symbol) {
          // Символ продолжает текущий префикс
          newPrefixLen = prefixLen + 1
        } else {
          // Символ не продолжает префикс, используем откат
          newPrefixLen = computeNextPrefix(prefixLen, symbol)
        }
        
        // Новый остаток длины
        const newLengthMod = (lengthMod + 1) % multiplicity
        
        // Создаем переход
        const nextState = getOrCreateState(newPrefixLen, newLengthMod)
        transitions[currentState][symbol] = nextState
      }
    }
  }
  
  // Финальные состояния: подстрока найдена (prefixLen === substringLen) И длина кратна multiplicity (lengthMod === 0)
  const finalStates = new Set()
  for (let lengthMod = 0; lengthMod < multiplicity; lengthMod++) {
    const state = getOrCreateState(substringLen, lengthMod)
    if (lengthMod === 0) {
      finalStates.add(state)
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
