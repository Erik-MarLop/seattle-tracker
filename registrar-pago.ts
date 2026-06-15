import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function registrarMensualidad(
  nombreMeta: string, 
  usdPagados: number, 
  mxnPagados: number
) {
  const TASA_REFERENCIA = 20.00;
  const tasaReal = +(mxnPagados / usdPagados).toFixed(2);
  const ahorroMxn = (TASA_REFERENCIA * usdPagados) - mxnPagados;

  console.log(`🚀 Intentando registrar: ${nombreMeta}...`);

  try {
    const nuevaMeta = await prisma.meta.create({
      data: {
        nombre: nombreMeta,
        objetivoUsd: usdPagados,
        categoria: "UNIVERSIDAD",
        pagos: {
          create: {
            descripcion: `Pago realizado con tasa de ${tasaReal}`,
            montoMxn: mxnPagados,
            montoUsd: usdPagados,
            tipoCambioReal: tasaReal,
          }
        }
      }
    });
    console.log(`✅ ÉXITO: Registro guardado. Ahorraste $${ahorroMxn.toFixed(2)} MXN vs la meta de $20.`);
  } catch (error) {
    console.error("❌ ERROR:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Registro de prueba con tus datos
registrarMensualidad("Mensualidad Enero + 1", 584, 10300);