-- AlterTable
ALTER TABLE "Seccion" ADD COLUMN     "ramaId" INTEGER;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "desafioActualId" INTEGER;

-- CreateTable
CREATE TABLE "Rama" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Rama_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rama_nombre_key" ON "Rama"("nombre");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_desafioActualId_fkey" FOREIGN KEY ("desafioActualId") REFERENCES "Rama"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seccion" ADD CONSTRAINT "Seccion_ramaId_fkey" FOREIGN KEY ("ramaId") REFERENCES "Rama"("id") ON DELETE SET NULL ON UPDATE CASCADE;
