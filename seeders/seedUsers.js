import db from "../config/database.js";
import seedUsers from "./seedUsersFunction.js"; // file fungsi seeding

const runSeeder = async () => {
  try {
    await db.authenticate(); // pastikan koneksi berhasil
    console.log("Database connected!");

    await db.sync(); // sinkronisasi model dengan tabel
    await seedUsers(); // jalankan fungsi seeding

    console.log("Seeder selesai!");
    process.exit(0); // keluar dari Node
  } catch (error) {
    console.error("Seeder gagal:", error);
    process.exit(1);
  }
};

runSeeder();
