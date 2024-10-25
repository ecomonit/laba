import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const emissionId = parseInt(params.id);
    const {year, quantity, factoryId}  = await request.json();

    const updatedEmission = await prisma.emission.update({
      where: { id: emissionId },
      data: {
        year: +year,
        quantity,
        factory_id: factoryId
      } 
    });

    return NextResponse.json(updatedEmission);
  } catch (error) {
    console.error('Error updating emission:', error);
    return NextResponse.json({ error: 'Failed to update emission' }, { status: 500 });
  }
}

// Новый ендпоинт для удаления по конкретному ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  console.log(params)
  try {
    const emissionId = parseInt(params.id);

    if (isNaN(emissionId)) {
      return NextResponse.json({ error: 'Invalid emission ID' }, { status: 400 });
    }

    await prisma.emission.delete({
      where: {
        id: emissionId,
      },
    });

    console.log(`Successfully deleted emission with ID: ${emissionId}`);
    return NextResponse.json({ message: `Emission with ID ${emissionId} deleted successfully` });
  } catch (error) {
    console.error('Error deleting emission:', error);
    return NextResponse.json({ error: 'Failed to delete emission' }, { status: 500 });
  }
}