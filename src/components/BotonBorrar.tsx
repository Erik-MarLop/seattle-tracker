"use client";
import { BotonBorrarProps } from "@/types";

export default function BotonBorrar({ id, accion }: BotonBorrarProps) {
  return (
    <form action={accion} className="inline" onSubmit={(e) => {
      if (!confirm("¿Estás seguro de que quieres eliminar este registro permanentemente?")) {
        e.preventDefault();
      }
    }}>
      <input type="hidden" name="id" value={id} />
      <button 
        type="submit" 
        className="text-red-400 hover:text-red-600 transition-colors text-xs font-bold uppercase tracking-wider cursor-pointer"
      >
        Borrar
      </button>
    </form>
  );
}