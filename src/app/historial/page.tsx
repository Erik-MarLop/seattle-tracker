import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import BotonBorrar from "@/components/BotonBorrar";
import { formatearMoneda, formatearFecha } from "@/utils/formatters";

export default async function HistorialPage() {
  const transacciones = await prisma.transaccion.findMany({
    include: { plan: true },
    orderBy: { fecha: "desc" }, // Lo más reciente primero
  });

  // Función para borrar (Server Action)
  async function borrarRegistro(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    await prisma.transaccion.delete({ where: { id } });
    revalidatePath("/historial");
  }

  return (
    <main className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Historial de Movimientos</h1>
        <Link href="/" className="text-blue-600 hover:underline font-medium">
          ← Volver al Tablero
        </Link>
      </div>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-xs uppercase font-bold text-slate-500">Fecha</th>
              <th className="p-4 text-xs uppercase font-bold text-slate-500">Plan</th>
              <th className="p-4 text-xs uppercase font-bold text-slate-500">Descripción</th>
              <th className="p-4 text-xs uppercase font-bold text-slate-500">Monto MXN</th>
              <th className="p-4 text-xs uppercase font-bold text-slate-500 text-center">Tipo Cambio</th>
              <th className="p-4 text-xs uppercase font-bold text-slate-500 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transacciones.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 text-sm text-slate-600">
                  {formatearFecha(t.fecha)}
                </td>
                <td className="p-4 font-bold text-slate-700 text-sm">{t.plan.nombre}</td>
                <td className="p-4 text-slate-600 text-sm">{t.descripcion}</td>
                <td className={`p-4 font-black ${t.tipo === 'INGRESO' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.tipo === 'INGRESO' ? '+' : '- '} {formatearMoneda(t.montoMxn)}
                </td>
                <td className="p-4 text-center">
                  {t.tipoCambio ? (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-bold">
                      ${t.tipoCambio}
                    </span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="p-4 text-right flex justify-end gap-3">
                    <Link 
                        href={`/nuevo?edit=${t.id}`} 
                        className="text-blue-400 hover:text-blue-600 transition-colors text-xs font-bold uppercase tracking-wider"
                    >
                        Editar
                    </Link>
                    <BotonBorrar id={t.id} accion={borrarRegistro} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}