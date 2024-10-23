import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Функція для обробки GET-запитів
export async function GET() {
  try {
    const factories = await prisma.factory.findMany({
      include: {
        emissions: {
          select: {
            year: true,
            quantity: true,
            pollutant: {
              select: { title: true },
            },
          },
        },
      },
    });

    // Повертаємо дані як JSON-відповідь
    return NextResponse.json(factories);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
