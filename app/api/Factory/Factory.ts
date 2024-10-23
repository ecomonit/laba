// pages/api/factories.js або pages/api/factories.ts
import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const response = await axios.get("http://localhost:5555/api/factories");
      const factories = response.data; // Переконайтеся, що це правильна структура даних
      res.status(200).json(factories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Помилка отримання даних з бази даних" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Метод ${req.method} не дозволений`);
  }
}
