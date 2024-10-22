'use client'

import Image from "next/image";
import prisma from "@/lip/prisma";

export default function Home() {
  const handleClick = async () => {
    await fetch("http://localhost:3000/api/user", {method:"DELETE"})
  }
  return (
   <button onClick={handleClick}>fghj</button>
  );
}
