"use client";

import { useEffect, useState } from 'react';
import "../styles/globals.css";

interface Emission {
  id: number;
  year: number;
  quantity: number;
  pollutant: string;
  name: string;
  factoryId: number;
  location: string;
}

interface Factory {
  id: number;
  name: string;
  location: string;
  emissions: Emission[];
}

export default function FactoriesTable() {
  const [emissions, setEmissions] = useState<Emission[]>([]);
  const [originalEmissions, setOriginalEmissions] = useState<Emission[]>([]);
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [sortCriteria, setSortCriteria] = useState<string>('year');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [factories, setFactories] = useState<Factory[]>([]);
  const [selectedFactory, setSelectedFactory] = useState<string>('all');

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
            factoryId: factory.id,
            location: factory.location,
          }))
        );
        setEmissions(allEmissions);
        setOriginalEmissions(allEmissions);
        setFactories(data);
      })
      .catch((error) => console.error('Error fetching emissions:', error));
  }, []);

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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCriteria = e.target.value;
    setSortCriteria(selectedCriteria);
    handleSort(selectedCriteria);
  };

  const resetSort = () => {
    setEmissions(originalEmissions);
    setSortCriteria('year');
    setSortOrder('asc');
    setSearchTerm('');
    setSelectedFactory('all');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterEmissions(term, selectedFactory);
  };

  const handleFactorySelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const factoryId = e.target.value;
    setSelectedFactory(factoryId);
    filterEmissions(searchTerm, factoryId);
  };

  const filterEmissions = (term: string, factoryId: string) => {
    let filteredEmissions = originalEmissions;

    if (term) {
      filteredEmissions = filteredEmissions.filter(emission =>
        emission.year.toString().includes(term) ||
        emission.pollutant.toLowerCase().includes(term) ||
        emission.name.toLowerCase().includes(term)
      );
    }

    if (factoryId !== 'all') {
      filteredEmissions = filteredEmissions.filter(emission => emission.factoryId === parseInt(factoryId));
    }

    setEmissions(filteredEmissions);
  };

  const handleFactoryChange = (e: React.ChangeEvent<HTMLSelectElement>, id: number) => {
    const selectedFactoryId = parseInt(e.target.value);
    const selectedFactory = factories.find(factory => factory.id === selectedFactoryId);
    const updatedEmissions = emissions.map((emission) =>
      emission.id === id ? { ...emission, name: selectedFactory?.name || '', factoryId: selectedFactoryId } : emission
    );
    setEmissions(updatedEmissions);
  };

  const handleContentEditableChange = (id: number, field: keyof Emission, value: string) => {
    const updatedEmissions = emissions.map((emission) =>
      emission.id === id ? { ...emission, [field]: field === 'quantity' ? parseFloat(value) : value } : emission
    );
    setEmissions(updatedEmissions);
  };

  const saveEdit = async (id: number) => {
    const editedEmission = emissions.find((emission) => emission.id === id);
    if (editedEmission) {
      try {
        const res = await fetch(`/api/emissions/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            year: editedEmission.year,
            quantity: editedEmission.quantity,
            pollutant: editedEmission.pollutant,
            factoryId: editedEmission.factoryId,
          }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        setOriginalEmissions(emissions);
      } catch (error) {
        console.error('Error updating emission:', error);
      }
    }
  };

  const deleteEmission = async (id: number) => {
    try {
      const res = await fetch(`/api/emissions/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const updatedEmissions = emissions.filter((emission) => emission.id !== id);
      setEmissions(updatedEmissions);
      setOriginalEmissions(updatedEmissions);
    } catch (error) {
      console.error('Error deleting emission:', error);
    }
  };

  return (
    <div className="table-container">
      <div className="search-and-sort">
        <input
          type="text"
          placeholder="Введіть рік, назву забруднювача або підприємства..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <div className="sort-controls">
          <div className="sort-dropdown">
            <label htmlFor="factorySelect">Виберіть завод: </label>
            <select id="factorySelect" onChange={handleFactorySelectChange} value={selectedFactory}>
              <option value="all">Усі заводи</option>
              {factories.map(factory => (
                <option key={factory.id} value={factory.id}>{factory.name}</option>
              ))}
            </select>
          </div>
          <div className="sort-dropdown">
            <label htmlFor="sortCriteria">Сортувати за: </label>
            <select id="sortCriteria" onChange={handleSelectChange} value={sortCriteria}>
              <option value="year">Рік</option>
              <option value="name">Назва</option>
              <option value="pollutant">Вид забруднювача</option>
            </select>
          </div>
          <button onClick={resetSort} className="reset-button">Скинути сортування</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Рік</th>
            <th>Назва</th>
            <th>Забруднювач</th>
            <th>Кількість</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {emissions.map((emission) => (
            <tr key={emission.id}>
              <td>{emission.id}</td>
              <td
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleContentEditableChange(emission.id, 'year', e.currentTarget.textContent || '')}
              >
                {emission.year}
              </td>
              <td>
                <select
                  value={emission.factoryId}
                  onChange={(e) => handleFactoryChange(e, emission.id)}
                >
                  {factories.map(factory => (
                    <option key={factory.id} value={factory.id}>{factory.name}</option>
                  ))}
                </select>
              </td>
              <td
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleContentEditableChange(emission.id, 'pollutant', e.currentTarget.textContent || '')}
              >
                {emission.pollutant}
              </td>
              <td
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleContentEditableChange(emission.id, 'quantity', e.currentTarget.textContent || '')}
              >
                {emission.quantity}
              </td>
              <td>
                <button className="save-button" onClick={() => saveEdit(emission.id)}>Зберегти</button>
                <button className="delete-button" onClick={() => deleteEmission(emission.id)}>Видалити</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
