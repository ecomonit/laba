import Image from "next/image";
import prisma from "@/lip/prisma";

export default async function Home() {
  const users = await prisma.user.findMany()
  console.log(users);

  return (
   <h1>Hello world!</h1>
  );
}
