"use client";

import { useFormStatus } from "react-dom";
import { toast } from "sonner";

export default function BotonGuardar({ esEdicion }: { esEdicion: boolean }) {
  const { pending } = useFormStatus();

  // Si el botón es presionado, mostramos la burbuja de éxito
  const handleClick = () => {
    // Usamos setTimeout para que la notificación salga justo cuando inicia la acción
    setTimeout(() => {
       toast.success(esEdicion ? "Transacción actualizada" : "Transacción guardada exitosamente");
    }, 100);
  };

  return (
    <button 
      type="submit" 
      disabled={pending}
      onClick={handleClick}
      className={`flex-2 text-white font-bold py-3 rounded-xl transition-colors ${
        pending ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {pending ? "Guardando..." : esEdicion ? "Guardar Cambios" : "Guardar Transacción"}
    </button>
  );
}