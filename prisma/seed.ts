// prisma/seed.ts

import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "./generated/client";
import "dotenv/config";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Cek apakah sudah ada user
  const existingUser = await prisma.user.findFirst({
    where: { email: "owner@kopijenaka.com" },
  });

  if (!existingUser) {
    // Kita buat user dummy, password hash harus digenerate sesuai standar better-auth atau
    // Cara termudah: Jalankan aplikasi, Register lewat UI sebagai user biasa -> Lalu masuk database -> Ubah role jadi OWNER manual.
    // Tapi jika ingin via code:

    console.log(
      "Silakan register manual user pertama via UI, lalu jalankan update query di database untuk mengubah role menjadi OWNER."
    );
  } else {
    // Atau jika ingin membuat data master Menu (Kategori)
    await prisma.category.createMany({
      data: [
        { name: "Coffee" },
        { name: "Non-Coffee" },
        { name: "Snack" },
        { name: "Main Course" },
      ],
    });
    console.log("Categories seeded.");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
