import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Функція для обробки GET-запитів
export async function GET() {
  try {
    // Отримуємо дані з бази
    const factories = await prisma.factory.findMany({
      include: {
        emissions: {
          select: {
            year: true,
            quantity: true,
            pollutant: {
              select: { name: true }, // змінив title на name згідно з моделлю
            },
          },
        },
      },
    });

    // Форматуємо дані для зручного рендерингу
    const formattedData = factories.map(factory => ({
      id: factory.id,
      name: factory.name,
      location: factory.location,
      emissions: factory.emissions.map(emission => ({
        year: emission.year,
        quantity: emission.quantity,
        pollutant: emission.pollutant.name,
      })),
    }));

    // Повертаємо дані як JSON-відповідь
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { ids } = await request.json();
    console.log('Received IDs for deletion:', ids);

    if (!ids || ids.length === 0) {
      return NextResponse.json({ error: 'No IDs provided for deletion' }, { status: 400 });
    }

    await prisma.emission.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    console.log(`Successfully deleted records with IDs: ${ids}`);
    return NextResponse.json({ message: 'Emissions deleted successfully' });
  } catch (error) {
    console.error('Error deleting emissions:', error);
    return NextResponse.json({ error: 'Failed to delete emissions' }, { status: 500 });
  }
}
