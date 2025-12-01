import React from 'react'
import { X } from 'lucide-react'

export default function ThemeModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Тема курсовой работы</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6 text-gray-700">
          <div>
            <h3 className="font-bold text-lg mb-2">Тема 1: Построение конструкций, задающих язык</h3>
            <p className="text-sm leading-relaxed">
              Написать программу, которая по предложенному описанию языка построит детерминированный конечный автомат,
              распознающий этот язык, и проверит вводимые с клавиатуры цепочки на их принадлежность языку.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Вариант задания</h3>
            <p className="text-sm font-semibold text-blue-600 mb-2">
              Язык задается следующими параметрами:
            </p>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li>
                <strong>Алфавит</strong> - набор символов, из которых состоят цепочки языка
              </li>
              <li>
                <strong>Обязательная фиксированная подцепочка</strong> - последовательность символов, которая должна присутствовать в каждой цепочке языка
              </li>
              <li>
                <strong>Кратность длины цепочек</strong> - длина всех цепочек языка должна быть кратна этому числу
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Требования к программе</h3>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li>Наличие графического интерфейса</li>
              <li>Меню с пунктами "Автор", "Тема", "Расчёты", "Запись результатов в файл"</li>
              <li>Форма для ввода данных с клавиатуры</li>
              <li>Справка с примерами формата данных</li>
              <li>Пошаговое отображение процесса проверки цепочек</li>
              <li>Функция переходов ДКА в виде таблицы и графа</li>
              <li>Экспорт результатов в файл</li>
              <li>Обработка ошибок с соответствующей диагностикой</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
            <h4 className="font-bold text-gray-800 mb-2">Ограничения</h4>
            <p className="text-sm text-gray-700 mb-2">
              Программа должна описать следующие ограничения:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Размер алфавита - не ограничен</li>
              <li>Обязательная подцепочка - должна быть непустой</li>
              <li>Кратность - должна быть положительным целым числом</li>
              <li>Входные цепочки должны состоять из символов алфавита</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Пример использования</h3>
            <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm font-mono space-y-1">
              <p>
                <span className="text-blue-600">Алфавит:</span> <span className="text-green-600">a, b</span>
              </p>
              <p>
                <span className="text-blue-600">Обязательная подцепочка:</span> <span className="text-green-600">ab</span>
              </p>
              <p>
                <span className="text-blue-600">Кратность:</span> <span className="text-green-600">2</span>
              </p>
              <p className="mt-2 text-gray-600">
                Язык состоит из цепочек четной длины, содержащих подцепочку "ab"
              </p>
              <p className="text-gray-600">
                Примеры: <span className="text-green-600">ab</span>, <span className="text-green-600">abab</span>, <span className="text-green-600">aabb</span>, <span className="text-green-600">baba</span>
              </p>
            </div>
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
