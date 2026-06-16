import { prisma } from "@/lib/prisma";
import Link from "next/link"
import { formatearMoneda } from "@/utils/formatters";

export default async function HomePage() {
  // 1. Traer datos de la DB (Igual que en el script)
  const planes = await prisma.plan.findMany({
    include: { transacciones: true },
  });

  // 2. Lógica de cálculo
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
            <Link href="/nuevo" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              + Nuevo Registro
            </Link>
            <Link href="/historial" className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
              Ver Historial
            </Link>
          </div>
        </div>
        <div className="text-right bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-200">
          <p className="text-xs uppercase font-bold tracking-widest opacity-80">Total Global</p>
          <p className="text-3xl font-black">{formatearMoneda(granTotal)} MXN</p>
        </div>
      </header>

      {/* Grid de Planes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {planesCalculados.map((plan) => (
          <div key={plan.nombre} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
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
    </main>
  );
}