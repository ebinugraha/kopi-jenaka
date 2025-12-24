// prisma/seed.ts

import { prisma } from "@/db/client";
import { auth } from "../src/utils/auth"; // Pastikan path import benar (mungkin perlu penyesuaian karena file ini dijalankan ts-node)
// Note: Karena better-auth hashing passwordnya internal, untuk seed manual seringkali kita butuh bypass atau menggunakan api create user dari better-auth jika memungkinkan.
// TAPI, cara paling mudah untuk seed manual adalah membuat user lewat prisma biasa lalu kita set password manual (jika better-auth support) atau membiarkan owner register pertama kali.
// ALTERNATIF AMAN:
// Kita buat user di DB, tapi passwordnya nanti di-set lewat fitur "Forgot Password" atau kita gunakan method helper jika ada.

async function main() {
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
