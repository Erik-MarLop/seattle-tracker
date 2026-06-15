import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const planesFijados = [
    { nombre: 'Ahorro Mensualidad' },
    { nombre: 'Ahorro Viaje Seattle' },
    { nombre: 'Fondo Meses Sin Ingreso' },
    { nombre: 'Gastos Administrativos' },
  ]

  console.log('Iniciando la creación de planes...');

  for (const p of planesFijados) {
    await prisma.plan.upsert({
      where: { nombre: p.nombre },
      update: {}, // Si ya existe, no hace nada
      create: {
        nombre: p.nombre,
        saldoMxn: 0, // Iniciamos en 0 para que tú metas los registros manuales
      },
    })
  }

  console.log('Los 4 planes de tu Tablero de Control han sido creados.');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })