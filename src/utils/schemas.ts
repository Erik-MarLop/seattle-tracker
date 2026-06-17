import { z } from "zod";

export const transaccionSchema = z.object({
  descripcion: z.string().min(2, "La descripción es muy corta").max(100, "Muy larga"),
  montoMxn: z.coerce.number().positive("El monto debe ser mayor a 0"),
  tipo: z.enum(["INGRESO", "EGRESO"]),
  planId: z.coerce.number().positive("Debe seleccionar un plan válido"),
});