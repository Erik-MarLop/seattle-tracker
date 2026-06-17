"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function borrarRegistro(formData: FormData) {
  const id = Number(formData.get("id"));
  
  await prisma.transaccion.delete({ 
    where: { id } 
  });
  
  revalidatePath("/historial");
}