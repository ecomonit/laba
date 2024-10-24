"use client";

import { useEffect, useState } from 'react';
import "../styles/globals.css";

interface Emission {
  id: number;
  year: number;
  quantity: number;
  pollutant: string;
  name: string;
  location: string;
}

interface Factory {
  name: string;
  location: string;
  emissions: Emission[];
}

export default function FactoriesTable() {
  const [emissions, setEmissions] = useState<Emission[]>([]);
  const [originalEmissions, setOriginalEmissions] = useState<Emission[]>([]);
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [sortCriteria, setSortCriteria] = useState<string>('year');
  const [searchTerm, setSearchTerm] = useState<string>(''); // Состояние для поискового запроса

  useEffect(() => {
    fetch('/api/factories')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: Factory[]) => {
        let idCounter = 1;
        const allEmissions = data.flatMap((factory) =>
          factory.emissions.map((emission) => ({
            id: idCounter++,
            year: emission.year,
            quantity: emission.quantity,
            pollutant: emission.pollutant,
            name: factory.name,
            location: factory.location,
          }))
        );
        setEmissions(allEmissions);
        setOriginalEmissions(allEmissions); // Сохраняем исходные данные
      })
      .catch((error) => console.error('Error fetching emissions:', error));
  }, []);

  // Функция сортировки
  const handleSort = (criteria: string) => {
    const sortedEmissions = [...emissions].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[criteria] > b[criteria] ? 1 : -1;
      } else {
        return a[criteria] < b[criteria] ? 1 : -1;
      }
    });
    setEmissions(sortedEmissions);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Обработчик изменения выпадающего списка
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCriteria = e.target.value;
    setSortCriteria(selectedCriteria);
    handleSort(selectedCriteria);
  };

  // Функция сброса сортировки
  const resetSort = () => {
    setEmissions(originalEmissions); // Возвращаем исходные данные
    setSortCriteria('year'); // Сбрасываем выбранный критерий
    setSortOrder('asc'); // Сбрасываем порядок сортировки
    setSearchTerm(''); // Сбрасываем строку поиска
  };

  // Функция удаления записи
  const deleteEmission = async (id: number) => {
    try {
      const res = await fetch(`/api/emission/${id}`, {
        method: 'DELETE',
      });
  
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
  
      // Оновлюємо стан після видалення
      const updatedEmissions = emissions.filter((emission) => emission.id !== id);
      setEmissions(updatedEmissions);
      setOriginalEmissions(updatedEmissions);
    } catch (error) {
      console.error('Error deleting emission:', error);
    }
  };
  

  // Обработчик изменения поискового поля с расширенным поиском
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase(); // Приводим к нижнему регистру для удобства поиска
    setSearchTerm(term);
    if (term === '') {
      setEmissions(originalEmissions); // Показать все данные, если строка поиска пуста
    } else {
      const filteredEmissions = originalEmissions.filter(emission =>
        emission.year.toString().includes(term) || // Фильтр по году
        emission.pollutant.toLowerCase().includes(term) || // Фильтр по виду загрязнителя
        emission.name.toLowerCase().includes(term) // Фильтр по названию предприятия
      );
      setEmissions(filteredEmissions);
    }
  };

  return (
    <div className="table-container">
      <div className="search-and-sort">
        <input
          type="text"
          placeholder="Введите год, название загрязнителя или предприятия..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <div className="sort-controls">
          <div className="sort-dropdown">
            <label htmlFor="sortCriteria">Сортировать по: </label>
            <select id="sortCriteria" onChange={handleSelectChange} value={sortCriteria}>
              <option value="year">Год</option>
              <option value="name">Имя</option>
              <option value="location">Местоположение</option>
              <option value="pollutant">Вид загрязнителя</option>
            </select>
          </div>
          <button onClick={resetSort} className="reset-button">Сбросить сортировку</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Year</th>
            <th>Name</th>
            <th>Location</th>
            <th>Pollutants</th>
            <th>Emissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {emissions.map((emission) => (
            <tr key={emission.id}>
              <td>{emission.id}</td>
              <td>{emission.year}</td>
              <td>{emission.name}</td>
              <td>{emission.location}</td>
              <td>{emission.pollutant}</td>
              <td>{emission.quantity}</td>
              <td>
                <button onClick={() => deleteEmission(emission.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
