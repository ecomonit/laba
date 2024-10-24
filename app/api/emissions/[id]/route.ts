import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const emissionId = parseInt(params.id);
    const { quantity } = await request.json();

    const updatedEmission = await prisma.emission.update({
      where: { id: emissionId },
      data: { quantity },
    });

    return NextResponse.json(updatedEmission);
  } catch (error) {
    console.error('Error updating emission:', error);
    return NextResponse.json({ error: 'Failed to update emission' }, { status: 500 });
  }
}
