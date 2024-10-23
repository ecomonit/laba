'use client';

import { useState, useEffect } from "react";

// Оголошуємо інтерфейс для даних
interface Factory {
  id: number;
  name: string;
  location: string;
}

export default function Home() {
  // Вказуємо, що factories — це масив об'єктів типу Factory
  const [factories, setFactories] = useState<Factory[]>([]);

  // Завантаження даних з API
  useEffect(() => {
    const fetchFactories = async () => {
      const response = await fetch("/api/Factory");
      const data: Factory[] = await response.json(); // Явно вказуємо тип даних
      setFactories(data);
    };
    fetchFactories();
  }, []);

  // Обробка видалення
  const handleClick = async () => {
    await fetch("/api/Factory", { method: "DELETE" });
    setFactories([]); // Очищаємо таблицю після видалення
  };

  return (
    <div>
      <button onClick={handleClick}>Видалити всі заводи</button>

      {/* Виведення таблиці */}
      {factories.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {factories.map((factory) => (
              <tr key={factory.id}>
                <td>{factory.id}</td>
                <td>{factory.name}</td>
                <td>{factory.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Заводи відсутні.</p>
      )}
    </div>
  );
}
