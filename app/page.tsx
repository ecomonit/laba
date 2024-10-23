import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h1>Ласкаво просимо до мого додатку!</h1>
      <nav>
        <ul>
          <li>
            <Link href="/Factory">Список Фабрик</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
