import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { NuevoRegistroPageProps } from "@/types";
import BotonGuardar from "@/components/BotonGuardar";
import { guardarTransaccion } from "./actions"; 

export default async function NuevoRegistro({ searchParams }: NuevoRegistroPageProps) {
  const planes = await prisma.plan.findMany();
  const params = await searchParams;
  
  // Buscamos el registro si existe el ID en la URL
  const idAEditar = params.edit ? Number(params.edit) : null;
  const transaccionPrevia = idAEditar 
    ? await prisma.transaccion.findUnique({ where: { id: idAEditar } }) 
    : null;

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">
        {transaccionPrevia ? "Editar Movimiento" : "Añadir Nuevo Movimiento"}
      </h1>
      
      <form action={guardarTransaccion} className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        
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
          <BotonGuardar esEdicion={!!transaccionPrevia} />
          
          <Link href="/historial" className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl text-center hover:bg-slate-200 transition-colors">
            Cancelar
          </Link>
        </div>
      </form>
    </main>
  );
}