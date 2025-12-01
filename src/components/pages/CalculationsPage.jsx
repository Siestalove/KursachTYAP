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
  
  // Вычисление KMP failure function для подстроки
  const buildFailureFunction = () => {
    const failure = new Array(substringLen + 1).fill(0)
    let j = 0
    
    for (let i = 1; i < substringLen; i++) {
      while (j > 0 && substringArray[i] !== substringArray[j]) {
        j = failure[j]
      }
      if (substringArray[i] === substringArray[j]) {
        j++
      }
      failure[i + 1] = j
    }
    
    return failure
  }
  
  const failure = buildFailureFunction()
  
  // Функция перехода для поиска подстроки
  const getNextPrefixLen = (currentLen, symbol) => {
    let len = currentLen
    
    // Если уже нашли подстроку, откатываемся для поиска новых вхождений
    if (len === substringLen) {
      len = failure[len]
    }
    
    // Пытаемся продлить текущий префикс
    while (len > 0 && substringArray[len] !== symbol) {
      len = failure[len]
    }
    
    // Если символ совпадает, увеличиваем длину префикса
    if (substringArray[len] === symbol) {
      len++
    }
    
    return len
  }
  
  // Состояния представлены как (prefixLen, lengthMod, found)
  // found - был ли найден substring хотя бы один раз
  const states = new Set()
  const transitions = {}
  const stateMap = new Map()
  let stateId = 0
  
  const getOrCreateState = (prefixLen, lengthMod, found) => {
    const key = `${prefixLen},${lengthMod},${found}`
    if (stateMap.has(key)) {
      return stateMap.get(key)
    }
    const stateName = `q${stateId++}`
    states.add(stateName)
    stateMap.set(key, stateName)
    return stateName
  }
  
  // Начальное состояние
  const initialState = getOrCreateState(0, 0, false)
  
  // Построение всех состояний и переходов
  for (let found = 0; found <= 1; found++) {
    for (let prefixLen = 0; prefixLen <= substringLen; prefixLen++) {
      for (let lengthMod = 0; lengthMod < multiplicity; lengthMod++) {
        const currentState = getOrCreateState(prefixLen, lengthMod, found === 1)
        transitions[currentState] = {}
        
        for (const symbol of alphabetArray) {
          // Вычисляем новую длину префикса после чтения символа
          const newPrefixLen = getNextPrefixLen(prefixLen, symbol)
          
          // Вычисляем новый остаток длины
          const newLengthMod = (lengthMod + 1) % multiplicity
          
          // Проверяем, нашли ли мы подстроку
          const newFound = found === 1 || newPrefixLen === substringLen
          
          // Создаем переход
          const nextState = getOrCreateState(newPrefixLen, newLengthMod, newFound)
          transitions[currentState][symbol] = nextState
        }
      }
    }
  }
  
  // Финальные состояния: подстрока была найдена (found === true) И длина кратна multiplicity (lengthMod === 0)
  const finalStates = new Set()
  for (let prefixLen = 0; prefixLen <= substringLen; prefixLen++) {
    const finalState = getOrCreateState(prefixLen, 0, true)
    if (states.has(finalState)) {
      finalStates.add(finalState)
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
