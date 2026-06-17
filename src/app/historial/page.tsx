import { prisma } from "@/lib/prisma";
import Link from "next/link";
import BotonBorrar from "@/components/BotonBorrar";
import { formatearMoneda, formatearFecha } from "@/utils/formatters";
import { borrarRegistro } from "./actions";

export default async function HistorialPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const terminoBusqueda = params.q || "";

  const transacciones = await prisma.transaccion.findMany({
    where: terminoBusqueda
      ? { descripcion: { contains: terminoBusqueda } }
      : {},
    include: { plan: true },
    orderBy: { fecha: "desc" },
  });

  return (
    <main className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Historial de Movimientos</h1>
        <Link href="/" className="text-sky-600 hover:text-sky-800 transition-colors duration-300 font-medium flex items-center gap-2">
          ← Volver al Tablero
        </Link>
      </div>

      {/* BUSCADOR MINIMALISTA */}
      <form method="GET" action="/historial" className="mb-6 max-w-md">
        <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 focus-within:ring-2 focus-within:ring-sky-200 focus-within:border-sky-400">
          
          {/* Ícono de Lupa */}
          <div className="pl-4 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>

          <input 
            type="text" 
            name="q" 
            defaultValue={terminoBusqueda} 
            placeholder="Buscar registro..." 
            className="flex-1 w-full py-3 px-3 text-sm text-slate-700 bg-transparent focus:outline-none"
          />

          {/* Botón sutil de Limpiar (X) con transición */}
          {terminoBusqueda && (
            <Link href="/historial" className="px-3 text-slate-300 hover:text-rose-500 transition-colors duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </Link>
          )}

          {/* Botón Buscar Integrado */}
          <button type="submit" className="bg-sky-50 text-sky-700 px-5 py-3 text-sm font-bold hover:bg-sky-100 transition-colors duration-300 border-l border-slate-200">
            Buscar
          </button>
        </div>
      </form>

      <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-slate-200">
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
            {transacciones.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                  No se encontraron movimientos.
                </td>
              </tr>
            ) : (
              transacciones.map((t) => (
                <tr key={t.id} className="hover:bg-sky-50/50 transition-colors duration-300">
                  <td className="p-4 text-sm text-slate-600">{formatearFecha(t.fecha)}</td>
                  <td className="p-4 font-bold text-slate-700 text-sm">{t.plan.nombre}</td>
                  <td className="p-4 text-slate-600 text-sm">{t.descripcion}</td>
                  <td className={`p-4 font-black ${t.tipo === 'INGRESO' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.tipo === 'INGRESO' ? '+' : '- '} {formatearMoneda(t.montoMxn)}
                  </td>
                  <td className="p-4 text-center">
                    {t.tipoCambio ? (
                      <span className="bg-sky-100 text-sky-700 px-2 py-1 rounded-md text-xs font-bold">
                        ${t.tipoCambio}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                <td className="p-4 text-right flex justify-end gap-3">
                    <Link 
                          href={`/nuevo?edit=${t.id}`} 
                          className="text-sky-500 hover:text-sky-700 transition-colors text-xs font-bold uppercase tracking-wider mt-2"
                      >
                          Editar
                      </Link>
                    <BotonBorrar id={t.id} accion={borrarRegistro} />
                </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}