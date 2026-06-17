"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { transaccionSchema } from "@/utils/schemas";

export async function guardarTransaccion(formData: FormData) {
  // 1. Identificamos si es una edición
  const id = formData.get("id") ? Number(formData.get("id")) : null;

  // 2. Extraemos los datos principales crudos
  const datosCrudos = {
    descripcion: formData.get("descripcion"),
    montoMxn: formData.get("montoMxn"),
    tipo: formData.get("tipo"),
    planId: formData.get("planId"),
  };

  // Si los datos están mal, Zod detiene la ejecución aquí.
  const datosValidados = transaccionSchema.parse(datosCrudos);

  // 4. Procesamos los datos opcionales de Dólares
  const montoUsd = Number(formData.get("montoUsd")) || null;
  const montoTotalMxn = Number(formData.get("montoTotalMxn")) || null;
  const apoyoExtra = Number(formData.get("apoyoExtra")) || null;

  let tipoCambio = null;
  if (montoTotalMxn && montoUsd) {
    tipoCambio = Number((montoTotalMxn / montoUsd).toFixed(2));
  }

  // 5. Unimos todo en un paquete final seguro
  const dataFinal = {
    ...datosValidados,
    montoUsd,
    montoTotalMxn,
    apoyoExtra,
    tipoCambio,
  };

  // 6. Guardamos en la Base de Datos
  if (id) {
    await prisma.transaccion.update({
      where: { id },
      data: dataFinal,
    });
  } else {
    await prisma.transaccion.create({ data: dataFinal });
  }

  // 7. Redirigimos al terminar
  redirect("/historial");
}