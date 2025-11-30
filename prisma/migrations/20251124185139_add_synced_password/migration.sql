/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `cycle` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `exercise` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sport` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sporttype` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `synced_at` to the `cycle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `synced_at` to the `exercise` table without a default value. This is not possible if the table is not empty.
  - Made the column `value` on table `exercise` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `synced_at` to the `session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `synced_at` to the `sport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `synced_at` to the `sporttype` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cycle" DROP CONSTRAINT "cycle_session_id_fkey";

-- DropForeignKey
ALTER TABLE "exercise" DROP CONSTRAINT "exercise_cycle_id_fkey";

-- DropForeignKey
ALTER TABLE "exercise" DROP CONSTRAINT "exercise_sport_id_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_user_id_fkey";

-- DropForeignKey
ALTER TABLE "sport" DROP CONSTRAINT "sport_type_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "password" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "cycle" DROP CONSTRAINT "cycle_pkey",
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "synced_at" TIMESTAMPTZ(6) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "session_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "cycle_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "cycle_id_seq";

-- AlterTable
ALTER TABLE "exercise" DROP CONSTRAINT "exercise_pkey",
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "synced_at" TIMESTAMPTZ(6) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "cycle_id" SET DATA TYPE TEXT,
ALTER COLUMN "sport_id" SET DATA TYPE TEXT,
ALTER COLUMN "value" SET NOT NULL,
ADD CONSTRAINT "exercise_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "exercise_id_seq";

-- AlterTable
ALTER TABLE "session" DROP CONSTRAINT "session_pkey",
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "synced_at" TIMESTAMPTZ(6) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "session_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "session_id_seq";

-- AlterTable
ALTER TABLE "sport" DROP CONSTRAINT "sport_pkey",
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "synced_at" TIMESTAMPTZ(6) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "type_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "sport_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "sport_id_seq";

-- AlterTable
ALTER TABLE "sporttype" DROP CONSTRAINT "sporttype_pkey",
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "synced_at" TIMESTAMPTZ(6) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "sporttype_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "sporttype_id_seq";

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cycle" ADD CONSTRAINT "cycle_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "cycle"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "sport"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sport" ADD CONSTRAINT "sport_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "sporttype"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
