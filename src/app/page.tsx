import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatearMoneda } from "@/utils/formatters";
import GraficaPlanes from "@/components/GraficaPlanes";

export default async function HomePage() {
  // 1. Traer datos de la DB (Igual que en el script)
  const planes = await prisma.plan.findMany({
    include: { transacciones: true },
  });

  const planesCalculados = planes.map((plan) => {
    let totalAhorrado = 0;
    let totalGastado = 0;

    plan.transacciones.forEach((t) => {
      if (t.tipo === "INGRESO") totalAhorrado += t.montoMxn;
      else if (t.tipo === "EGRESO") totalGastado += t.montoMxn;
    });

    return {
      nombre: plan.nombre,
      disponible: totalAhorrado - totalGastado,
      totalAhorrado,
      totalGastado,
    };
  });

  const granTotal = planesCalculados.reduce((acc, p) => acc + p.disponible, 0);

  return (
    <main className="max-w-5xl mx-auto p-8">
      {/* Encabezado */}
      <header className="mb-12 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
            Seattle Tracker 🚀
          </h1>
          <div className="flex gap-4 mt-4">
            <Link href="/nuevo" className="bg-sky-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-sky-700 transition-all shadow-lg shadow-sky-100">
              + Nuevo Registro
            </Link>
            <Link href="/historial" className="bg-white border-2 border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold hover:border-sky-300 hover:text-sky-700 hover:bg-sky-50 transition-all shadow-sm">
              Ver Historial
            </Link>
          </div>
        </div>
        <div className="text-right bg-sky-700 text-white p-6 rounded-3xl shadow-xl shadow-sky-100">
          <p className="text-xs uppercase font-bold tracking-widest opacity-80">Total Global</p>
          <p className="text-3xl font-black">{formatearMoneda(granTotal)} MXN</p>
        </div>
      </header>

      {/* Grid de Planes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {planesCalculados.map((plan) => (
          <div key={plan.nombre} className="bg-white border-t-4 border-t-sky-600 border-x border-b border-slate-200 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-bold text-slate-700 mb-4 uppercase tracking-tight">{plan.nombre}</h2>
            
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-400 font-medium">Disponible</span>
              <span className={`text-2xl font-black ${plan.disponible >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatearMoneda(plan.disponible)}
              </span>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Ingresos Totales</span>
                <span className="font-bold text-slate-700">{formatearMoneda(plan.totalAhorrado)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Egresos Totales</span>
                <span className="font-bold text-slate-700">{formatearMoneda(plan.totalGastado)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <GraficaPlanes datos={planesCalculados} /> 
      
    </main>
  );
}