'use client';

import { useEffect, useState } from 'react';
import '../styles/globals.css';

export default function Home() {
  const [emissions, setEmissions] = useState([]);

  useEffect(() => {
    fetch('/api/factories')
      .then(response => response.json())
      .then(data => {
        const allEmissions = [];
        data.forEach(factory => {
          factory.emissions.forEach(emission => {
            allEmissions.push({
              id: allEmissions.length + 1, // Генеруємо унікальний ID
              year: emission.year,
              name: factory.name || 'N/A',
              location: factory.location || 'N/A',
              pollutant: emission.pollutant.title,
              quantity: emission.quantity,
            });
          });
        });
        setEmissions(allEmissions);
      })
      .catch(error => console.error('Error fetching factories:', error));
  }, []);

  return (
    <div>
      <h1>Factories and Emissions</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Year</th>
            <th>Name</th>
            <th>Location</th>
            <th>Pollutants</th>
            <th>Emissions</th>
          </tr>
        </thead>
        <tbody>
          {emissions.map(emission => (
            <tr key={emission.id}>
              <td>{emission.id}</td>
              <td>{emission.year}</td>
              <td>{emission.name}</td>
              <td>{emission.location}</td>
              <td>{emission.pollutant}</td>
              <td>{emission.quantity} tons</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
