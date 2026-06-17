"use client";

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatearMoneda } from '@/utils/formatters';

interface GraficaProps {
  datos: {
    nombre: string;
    totalAhorrado: number;
    totalGastado: number;
  }[];
}

export default function GraficaPlanes({ datos }: GraficaProps) {
  // Creamos un estado para saber si ya estamos en el navegador
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const truncateLabel = (label: string) => {
    return label.length > 15 ? `${label.substring(0, 12)}...` : label;
  };

  // Si aún no carga el navegador, mostramos un rectángulo gris animado
  if (!isMounted) {
    return (
      <div className="bg-slate-50 animate-pulse p-6 rounded-3xl border border-slate-200 mt-8" style={{ height: '480px' }}>
         <div className="h-4 bg-slate-200 rounded w-1/4 mb-6"></div>
         <div className="h-full w-full bg-slate-200/50 rounded-xl"></div>
      </div>
    );
  }

  return (
    // Subimos el alto a 480px para dar más aire y shadow-lg
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mt-8" style={{ height: '480px' }}>
      <h2 className="text-lg font-bold text-slate-700 mb-6 uppercase tracking-tight">Análisis Visual</h2>
      
      <ResponsiveContainer width="100%" height={420} minHeight={300} minWidth={300}>
        {/* Aumentamos el bottom a 40 para que la leyenda no se corte */}
        <BarChart data={datos} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          
          {/* Usamos tickFormatter, interval={0} y forzamos XAxis height */}
          <XAxis 
            dataKey="nombre" 
            axisLine={false} 
            tickLine={false} 
            tickFormatter={truncateLabel} 
            interval={0} 
            height={60} 
          />
          
          <YAxis 
            tickFormatter={(value) => `$${value}`} 
            axisLine={false} 
            tickLine={false}
            width={80}
          />
          <Tooltip 
            formatter={(value: any) => [formatearMoneda(Number(value) || 0), "Monto"]}
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          
          {/* Añadimos padding-bottom para separar la leyenda del borde */}
          <Legend wrapperStyle={{ paddingTop: '20px', paddingBottom: '10px' }} />
          
          <Bar dataKey="totalAhorrado" name="Ingresos (+)" fill="#22c55e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="totalGastado" name="Egresos (-)" fill="#dc2626" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}