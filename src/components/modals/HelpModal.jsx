import React, { useState } from 'react'
import { X } from 'lucide-react'

export default function HelpModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Справка и помощь</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex space-x-2 mb-4 border-b">
          {[
            { id: 'overview', label: 'Обзор' },
            { id: 'format', label: 'Формат данных' },
            { id: 'faq', label: 'FAQ' },
            { id: 'examples', label: 'Примеры' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-semibold transition ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-4 text-sm text-gray-700 max-h-96 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-2">Что такое ДКА?</h3>
                <p>
                  Детерминированный конечный автомат (ДКА) - это математическая модель, которая распознает регулярные языки.
                  ДКА имеет конечное число состояний, символы алфавита и правила переходов между состояниями.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">Как работает программа?</h3>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Введите параметры языка в разделе "Расчёты"</li>
                  <li>Система построит соответствующий ДКА</li>
                  <li>Введите цепочку для проверки</li>
                  <li>Программа покажет, принадлежит ли цепочка языку</li>
                  <li>Экспортируйте результаты в файл</li>
                </ol>
              </div>

              <div>
                <h3 className="font-bold mb-2">Основные разделы</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Главная:</strong> Введение и начало работы</li>
                  <li><strong>Расчёты:</strong> Построение ДКА и проверка цепочек</li>
                  <li><strong>Запись результатов:</strong> Экспорт в файл</li>
                  <li><strong>Справка:</strong> Эта справка</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'format' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-2">Формат ввода - Алфавит</h3>
                <p className="mb-2">Введите символы алфавита подряд без пробелов между ними:</p>
                <div className="bg-gray-100 p-2 rounded font-mono text-xs">
                  Верно: <span className="text-green-600">abc</span>, <span className="text-green-600">01</span>, <span className="text-green-600">xyz</span><br />
                  Неверно: <span className="text-red-600">a b c</span>, <span className="text-red-600">0, 1</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-2">Формат ввода - Обязательная подцепочка</h3>
                <p className="mb-2">Введите последовательность символов из алфавита:</p>
                <div className="bg-gray-100 p-2 rounded font-mono text-xs">
                  Верно: <span className="text-green-600">ab</span>, <span className="text-green-600">101</span><br />
                  Неверно: <span className="text-red-600">пусто</span>, <span className="text-red-600">символ вне алфавита</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-2">Формат ввода - Кратность</h3>
                <p className="mb-2">Введите положительное целое число:</p>
                <div className="bg-gray-100 p-2 rounded font-mono text-xs">
                  Верно: <span className="text-green-600">1</span>, <span className="text-green-600">2</span>, <span className="text-green-600">3</span><br />
                  Неверно: <span className="text-red-600">0</span>, <span className="text-red-600">-1</span>, <span className="text-red-600">1.5</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-2">Проверка цепочек</h3>
                <p className="mb-2">Введите цепочку только из символов алфавита:</p>
                <div className="bg-gray-100 p-2 rounded font-mono text-xs">
                  Пример (алфавит 'ab'): <span className="text-green-600">aabb</span>, <span className="text-green-600">abab</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-1">❓ Что означает "Обязательная подцепочка"?</h3>
                <p>
                  Это строка символов, которая должна присутствовать в каждой допустимой цепочке языка.
                  Например, если подцепочка "ab", то цепочки "ab", "aabb", "abab" содержат ее, а "ba" - нет.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-1">❓ Что означает "Кратность"?</h3>
                <p>
                  Это число, на которое должна делиться длина цепочки нацело.
                  Например, при кратности 2 допустимы цепочки длины 2, 4, 6, но не 3, 5, 7.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-1">❓ Почему программа отклонила мою цепочку?</h3>
                <p>
                  Цепочка отклоняется если:
                  <ul className="list-disc list-inside mt-1">
                    <li>Содержит символы, отсутствующие в алфавите</li>
                    <li>Не содержит обязательную подцепочку</li>
                    <li>Ее длина не кратна указанному числу</li>
                  </ul>
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-1">❓ Как сохранить результаты?</h3>
                <p>
                  Перейдите в раздел "Запись результатов" и нажмите кнопку "Экспортировать результаты".
                  Выберите формат (TXT или CSV) и скачайте файл.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-1">❓ Могу ли я изменить параметры после построения ДКА?</h3>
                <p>
                  Да! Просто введите новые параметры и нажмите "Построить ДКА". Предыдущие данные будут заменены.
                  Вы также можете нажать "Очистить" для сброса всех полей.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <h3 className="font-bold mb-2">Пример 1: Язык чётной длины с подцепочкой "ab"</h3>
                <div className="text-xs space-y-1 font-mono">
                  <p><strong>Параметры:</strong></p>
                  <p>Алфавит: <span className="bg-gray-200 px-1">ab</span></p>
                  <p>Подцепочка: <span className="bg-gray-200 px-1">ab</span></p>
                  <p>Кратность: <span className="bg-gray-200 px-1">2</span></p>
                  <p className="mt-2"><strong>Принимаются:</strong> ab, abab, aabb, abba, baab, ...</p>
                  <p><strong>Отклоняются:</strong> a, aba, b, ba, aab, ...</p>
                </div>
              </div>

              <div className="bg-green-50 p-3 rounded border border-green-200">
                <h3 className="font-bold mb-2">Пример 2: Язык длины, кратной 3, с подцепочкой "10"</h3>
                <div className="text-xs space-y-1 font-mono">
                  <p><strong>Параметры:</strong></p>
                  <p>Алфавит: <span className="bg-gray-200 px-1">01</span></p>
                  <p>Подцепочка: <span className="bg-gray-200 px-1">10</span></p>
                  <p>Кратность: <span className="bg-gray-200 px-1">3</span></p>
                  <p className="mt-2"><strong>Принимаются:</strong> 100, 101, 010, 100, 110, ...</p>
                  <p><strong>Отклоняются:</strong> 10, 1001, 01, 1010, ...</p>
                </div>
              </div>

              <div className="bg-purple-50 p-3 rounded border border-purple-200">
                <h3 className="font-bold mb-2">Пример 3: Язык с подцепочкой "aa"</h3>
                <div className="text-xs space-y-1 font-mono">
                  <p><strong>Параметры:</strong></p>
                  <p>Алфавит: <span className="bg-gray-200 px-1">ab</span></p>
                  <p>Подцепочка: <span className="bg-gray-200 px-1">aa</span></p>
                  <p>Кратность: <span className="bg-gray-200 px-1">1</span></p>
                  <p className="mt-2"><strong>Принимаются:</strong> aa, aaa, baa, aab, baab, ...</p>
                  <p><strong>Отклоняются:</strong> a, ab, ba, bb, aba, bba, ...</p>
                </div>
              </div>
            </div>
          )}
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
