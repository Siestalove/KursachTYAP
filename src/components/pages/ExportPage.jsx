import React, { useState } from 'react'
import { Download, FileText } from 'lucide-react'

export default function ExportPage() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [exportFormat, setExportFormat] = useState('txt')

  const exportResults = () => {
    setError('')
    setSuccess('')

    const results = JSON.parse(localStorage.getItem('dfa_data') || '{}')

    if (!results.dfa) {
      setError('Нет данных для экспорта. Сначала постройте ДКА и проверьте цепочки.')
      return
    }

    let content = ''
    const timestamp = new Date().toLocaleString('ru-RU')

    if (exportFormat === 'txt') {
      content = generateTextReport(results, timestamp)
    } else if (exportFormat === 'csv') {
      content = generateCSVReport(results)
    }

    downloadFile(content, exportFormat)
    setSuccess(`Результаты успешно экспортированы в формате ${exportFormat.toUpperCase()}`)
  }

  const downloadFile = (content, format) => {
    const element = document.createElement('a')
    const mimeType = format === 'txt' ? 'text/plain' : 'text/csv'
    element.setAttribute('href', `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`)
    element.setAttribute('download', `dfa-results-${Date.now()}.${format}`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Запись результатов в файл</h2>

        <div className="mb-6 p-4 bg-blue-50 rounded border border-blue-200">
          <p className="text-gray-700">
            На этой странице вы можете экспортировать результаты построения ДКА и проверки цепочек в различные форматы.
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Выберите формат экспорта:
          </label>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition">
              <input
                type="radio"
                value="txt"
                checked={exportFormat === 'txt'}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-4 h-4"
              />
              <div>
                <p className="font-semibold text-gray-800">Текстовый формат (.txt)</p>
                <p className="text-sm text-gray-600">Полный отчет с форматированием</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition">
              <input
                type="radio"
                value="csv"
                checked={exportFormat === 'csv'}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-4 h-4"
              />
              <div>
                <p className="font-semibold text-gray-800">CSV формат (.csv)</p>
                <p className="text-sm text-gray-600">Данные проверки цепочек в таблице</p>
              </div>
            </label>
          </div>
        </div>

        {error && <div className="error-message mb-4">{error}</div>}
        {success && <div className="success-message mb-4">{success}</div>}

        <button
          onClick={exportResults}
          className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          <Download size={20} />
          <span>Экспортировать результаты</span>
        </button>

        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-bold text-gray-800">О форматах:</h3>

          <div className="border rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <FileText className="text-blue-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <h4 className="font-bold text-gray-800">Текстовый формат (.txt)</h4>
                <p className="text-gray-600 mt-2">
                  Полный отчет включает:
                </p>
                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                  <li>• Параметры языка (алфавит, подцепочка, кратность)</li>
                  <li>• Состояния и переходы ДКА</li>
                  <li>• Таблица функции переходов</li>
                  <li>• Все результаты проверки цепочек</li>
                  <li>• Пошаговое выполнение для каждой проверки</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <FileText className="text-green-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <h4 className="font-bold text-gray-800">CSV формат (.csv)</h4>
                <p className="text-gray-600 mt-2">
                  Таблица с результатами проверки:
                </p>
                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                  <li>• Номер проверки</li>
                  <li>• Проверяемая цепочка</li>
                  <li>• Результат (принята/отклонена)</li>
                  <li>• Причина результата</li>
                  <li>• Время проверки</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function generateTextReport(results, timestamp) {
  let report = `ОТЧЕТ О ПОСТРОЕНИИ ДКА И ПРОВЕРКЕ ЦЕПОЧЕК\n`
  report += `${'='.repeat(60)}\n`
  report += `Дата и время: ${timestamp}\n\n`

  if (results.dfa) {
    const dfa = results.dfa
    report += `ПАРАМЕТРЫ ЯЗЫКА:\n`
    report += `${'─'.repeat(60)}\n`
    report += `Алфавит: ${dfa.alphabet.join(', ')}\n`
    report += `Обязательная подцепочка: ${dfa.substring}\n`
    report += `Кратность длины: ${dfa.multiplicity}\n\n`

    report += `ХАРАКТЕРИСТИКИ ДКА:\n`
    report += `${'─'.repeat(60)}\n`
    report += `Количество состояний: ${dfa.states.length}\n`
    report += `Начальное состояние: ${dfa.initialState}\n`
    report += `Финальные состояния: ${dfa.finalStates.join(', ')}\n`
    report += `Количество финальных состояний: ${dfa.finalStates.length}\n\n`

    report += `ТАБЛИЦА ФУНКЦИИ ПЕРЕХОДОВ:\n`
    report += `${'─'.repeat(60)}\n`

    const columnWidths = [12, ...dfa.alphabet.map(() => 8), 15]
    const headers = ['Состояние', ...dfa.alphabet, 'Тип']

    report += headers.map((h, i) => h.padEnd(columnWidths[i])).join('') + '\n'
    report += '─'.repeat(columnWidths.reduce((a, b) => a + b, 0)) + '\n'

    for (const state of dfa.states) {
      let row = state.padEnd(columnWidths[0])
      for (const symbol of dfa.alphabet) {
        const nextState = dfa.transitions[state]?.[symbol] || '-'
        row += nextState.padEnd(columnWidths[dfa.alphabet.indexOf(symbol) + 1])
      }

      let type = ''
      if (dfa.initialState === state) type += 'Начальное'
      if (dfa.finalStates.includes(state)) {
        if (type) type += ', '
        type += 'Финальное'
      }
      row += type.padEnd(columnWidths[columnWidths.length - 1])

      report += row + '\n'
    }

    report += '\n'
  }

  if (results.checkResults && results.checkResults.length > 0) {
    report += `РЕЗУЛЬТАТЫ ПРОВЕРКИ ЦЕПОЧЕК:\n`
    report += `${'─'.repeat(60)}\n`
    report += `Всего проверено: ${results.checkResults.length}\n`
    report += `Принято: ${results.checkResults.filter(r => r.accepted).length}\n`
    report += `Отклонено: ${results.checkResults.filter(r => !r.accepted).length}\n\n`

    for (let i = 0; i < results.checkResults.length; i++) {
      const result = results.checkResults[i]
      report += `\n${'▾'.repeat(3)} Проверка ${i + 1}\n`
      report += `Цепочка: "${result.string}"\n`
      report += `Результат: ${result.accepted ? 'ПРИНЯТА' : 'ОТКЛОНЕНА'}\n`
      report += `Причина: ${result.reason}\n`

      if (result.steps && result.steps.length > 0) {
        report += `\nПошаговое выполнение:\n`
        for (const step of result.steps) {
          report += `  Шаг ${step.step}: ${step.description}\n`
        }
      }
    }
  }

  return report
}

function generateCSVReport(results) {
  let csv = 'Номер,Цепочка,Результат,Причина,Время\n'

  if (results.checkResults && results.checkResults.length > 0) {
    for (let i = 0; i < results.checkResults.length; i++) {
      const result = results.checkResults[i]
      const reason = result.reason.replace(/"/g, '""')
      csv += `${i + 1},"${result.string}","${result.accepted ? 'ПРИНЯТА' : 'ОТКЛОНЕНА'}","${reason}","${result.timestamp || ''}"\n`
    }
  }

  return csv
}
