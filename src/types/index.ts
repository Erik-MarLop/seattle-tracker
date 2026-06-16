import { Prisma } from "@prisma/client";

// 1. PRISMA
// Usamos `GetPayload` para crear un tipo perfecto de una Transacción unida a un Plan.
export type TransaccionConPlan = Prisma.TransaccionGetPayload<{
  include: { plan: true };
}>;

// 2. INTERFAZ DE COMPONENTES:
// En lugar de escribir esto directo en el botón, lo centralizamos.
export interface BotonBorrarProps {
  id: number;
  accion: (formData: FormData) => void;
}

// 3. INTERFAZ DE PÁGINAS (App Router):
// Molde para los parámetros de URL que usamos en el formulario.
export interface NuevoRegistroPageProps {
  searchParams: Promise<{ edit?: string }>;
}