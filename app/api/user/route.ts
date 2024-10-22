import prisma from "@/lip/prisma"

export async function DELETE() {
  await prisma.user.delete({where: {
    email: 'gvbhn',
  },})
}