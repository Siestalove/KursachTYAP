import React from 'react'
import { Zap, BookOpen, Network } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="py-8">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Конструктор ДКА
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          Построение Детерминированного Конечного Автомата по описанию языка
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
            <Network className="text-blue-600" size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Построение ДКА</h3>
          <p className="text-gray-600">
            Создайте детерминированный конечный автомат на основе:
          </p>
          <ul className="mt-3 text-sm text-gray-600 space-y-1">
            <li>• Алфавита</li>
            <li>• Обязательной подцепочки</li>
            <li>• Кратности длины цепочек</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
            <Zap className="text-green-600" size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Проверка Цепочек</h3>
          <p className="text-gray-600">
            Проверьте принадлежность введённых цепочек к языку с пошаговым отображением процесса.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
            <BookOpen className="text-purple-600" size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Визуализация</h3>
          <p className="text-gray-600">
            Просмотрите функцию переходов в виде таблицы или графа.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
        <h3 className="text-lg font-bold text-blue-800 mb-3">Начало работы:</h3>
        <ol className="list-decimal list-inside text-gray-700 space-y-2">
          <li>Перейдите в раздел <strong>"Расчёты"</strong> для построения ДКА</li>
          <li>Введите параметры языка (алфавит, подцепочка, кратность)</li>
          <li>Система автоматически построит автомат</li>
          <li>Проверьте цепочки на принадлежность языку</li>
          <li>Экспортируйте результаты в файл через <strong>"Запись результатов"</strong></li>
        </ol>
      </div>
    </div>
  )
}
