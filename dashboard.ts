import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function generarTablero() {
  console.log("PROCESANDO DATOS Y ACTUALIZANDO TABLERO...\n");

  const planes = await prisma.plan.findMany({
    include: { transacciones: true }
  });

  let granTotalDisponible = 0;

  for (const plan of planes) {
    let totalAhorrado = 0;
    let totalGastado = 0;

    console.log(`--- PLAN: ${plan.nombre.toUpperCase()} ---`);

    for (const t of plan.transacciones) {
      if (t.tipo === 'INGRESO') {
        totalAhorrado += t.montoMxn;
      } else if (t.tipo === 'EGRESO') {
        totalGastado += t.montoMxn;

        //LÓGICA DE ACTUALIZACIÓN AUTOMÁTICA
        if (t.montoTotalMxn && t.montoUsd) {
          const tcCalculado = +(t.montoTotalMxn / t.montoUsd).toFixed(2);
          
          // Si la base de datos no tiene el TC, lo grabamos físicamente
          if (!t.tipoCambio) {
            await prisma.transaccion.update({
              where: { id: t.id },
              data: { tipoCambio: tcCalculado }
            });
            console.log(`\t  + [DB UPDATED] Se calculó y guardó TC: ${tcCalculado} para ${t.descripcion}`);
          } else {
            console.log(`\t  + Pago: ${t.descripcion} | TC Guardado: ${t.tipoCambio}`);
          }
        }
      }
    }

    const disponible = totalAhorrado - totalGastado;
    granTotalDisponible += disponible;

    console.log(`\t Total Ahorrado: $${totalAhorrado.toLocaleString()} MXN`);
    console.log(`\t Total Gastado:  $${totalGastado.toLocaleString()} MXN`);
    console.log(`\t DISPONIBLE:     $${disponible.toLocaleString()} MXN\n`);
  }

  console.log(`==========================================`);
  console.log(`\t TOTAL GLOBAL: $${granTotalDisponible.toLocaleString()} MXN`);
  console.log(`==========================================`);
}

generarTablero()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());