import React from 'react'
import { X } from 'lucide-react'

export default function AboutModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Об авторе</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4 text-gray-700">
          <div>
            <h3 className="font-bold text-lg mb-2">Информация о разработчике</h3>
            <p className="text-sm leading-relaxed">
              Данное приложение было разработано для решения курсовой работы по теме
              "Построение конструкций, задающих язык" в рамках дисциплины "Теория
              автоматов и формальных языков" (ТАУЯ).
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Цель приложения</h3>
            <p className="text-sm leading-relaxed">
              Приложение предназначено для:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 mt-2">
              <li>Построения детерминированного конечного автомата (ДКА)</li>
              <li>Проверки цепочек на принадлежность языку</li>
              <li>Визуализации функции переходов в виде таблицы и графа</li>
              <li>Экспорта результатов в различные форматы</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Технологии</h3>
            <p className="text-sm leading-relaxed">
              Приложение разработано на:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 mt-2">
              <li>React - фреймворк для создания интерфейса</li>
              <li>Vite - быстрый инструмент сборки</li>
              <li>Tailwind CSS - фреймворк для стилизации</li>
              <li>Lucide React - библиотека иконок</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <h4 className="font-bold text-gray-800 mb-2">Лицензия</h4>
            <p className="text-sm text-gray-700">
              Это учебный проект, разработанный в образовательных целях.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Закрыть
        </button>
      </div>
    </div>
  )
}
