import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { NuevoRegistroPageProps } from "@/types";

export default async function NuevoRegistro({ searchParams }: NuevoRegistroPageProps) {
  const planes = await prisma.plan.findMany();
  const params = await searchParams;
  
  // 1. ¿Estamos editando? Buscamos el registro si existe el ID en la URL
  const idAEditar = params.edit ? Number(params.edit) : null;
  const transaccionPrevia = idAEditar 
    ? await prisma.transaccion.findUnique({ where: { id: idAEditar } }) 
    : null;

  async function guardarTransaccion(formData: FormData) {
    "use server";

    const id = formData.get("id") ? Number(formData.get("id")) : null;
    const planId = Number(formData.get("planId"));
    const montoMxn = Number(formData.get("montoMxn"));
    const montoUsd = Number(formData.get("montoUsd")) || null;
    const montoTotalMxn = Number(formData.get("montoTotalMxn")) || null;
    const tipo = formData.get("tipo") as string;

    let tipoCambio = null;
    if (montoTotalMxn && montoUsd) {
      tipoCambio = Number((montoTotalMxn / montoUsd).toFixed(2));
    }

    const data = {
      descripcion: formData.get("descripcion") as string,
      tipo: tipo,
      montoMxn: montoMxn,
      montoUsd: montoUsd,
      montoTotalMxn: montoTotalMxn,
      apoyoExtra: Number(formData.get("apoyoExtra")) || null,
      tipoCambio: tipoCambio,
      planId: planId,
    };

    // 2. Lógica Dual: Si hay ID, actualiza. Si no, crea.
    if (id) {
      await prisma.transaccion.update({
        where: { id },
        data: data,
      });
    } else {
      await prisma.transaccion.create({ data: data });
    }

    redirect("/historial");
  }

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">
        {transaccionPrevia ? "Editar Movimiento" : "Añadir Nuevo Movimiento"}
      </h1>
      
      <form action={guardarTransaccion} className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        {/* Campo oculto para saber qué ID estamos editando */}
        <input type="hidden" name="id" value={transaccionPrevia?.id || ""} />

        <div>
          <label className="block text-sm font-medium text-slate-700">Descripción</label>
          <input 
            name="descripcion" 
            required 
            defaultValue={transaccionPrevia?.descripcion || ""}
            className="w-full p-2 border rounded-lg" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Tipo</label>
            <select name="tipo" required defaultValue={transaccionPrevia?.tipo || "INGRESO"} className="w-full p-2 border rounded-lg">
              <option value="INGRESO">Ingreso (+)</option>
              <option value="EGRESO">Egreso (-)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Plan</label>
            <select name="planId" required defaultValue={transaccionPrevia?.planId || ""} className="w-full p-2 border rounded-lg">
              {planes.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Monto MXN</label>
          <input 
            name="montoMxn" 
            type="number" 
            step="0.01" 
            required 
            defaultValue={transaccionPrevia?.montoMxn || ""}
            className="w-full p-2 border rounded-lg" 
          />
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-xs font-bold text-slate-400 uppercase mb-3">Solo para Egresos en Dólares</p>
          <div className="grid grid-cols-2 gap-4">
            <input name="montoUsd" type="number" step="0.01" defaultValue={transaccionPrevia?.montoUsd || ""} placeholder="Total USD" className="p-2 border rounded-lg" />
            <input name="montoTotalMxn" type="number" step="0.01" defaultValue={transaccionPrevia?.montoTotalMxn || ""} placeholder="Total MXN Ventanilla" className="p-2 border rounded-lg" />
            <input name="apoyoExtra" type="number" step="0.01" defaultValue={transaccionPrevia?.apoyoExtra || ""} placeholder="Apoyo Padres" className="p-2 border rounded-lg col-span-2" />
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">
            {transaccionPrevia ? "Guardar Cambios" : "Guardar Transacción"}
          </button>
          
          <Link href="/historial" className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl text-center hover:bg-slate-200">
            Cancelar
          </Link>
        </div>
      </form>
    </main>
  );
}