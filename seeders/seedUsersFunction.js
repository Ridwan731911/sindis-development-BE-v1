import Users from "../models/userModel.js";
import bcrypt from "bcryptjs";

const seedUsers = async () => {
  try {
    const usersData = [
{name: "Widuri-P Buoy No.1", role: "user", email: "OTH001", password:"widurioth001p",refresh_token: null, lat: "-4.66189166666667", lng: "106.629219444444", region: "other",type: "buoy",},
{name: "Widuri-P Buoy No.2", role: "user", email: "OTH002", password:"widurioth002p",refresh_token: null, lat: "-4.66199166666667", lng: "106.633988888889", region: "other",type: "buoy",},
{name: "Melati Barge Buoy", role: "user", email: "OTH003", password:"melatioth003",refresh_token: null, lat: "-5.183375", lng: "106.371711111111", region: "other",type: "buoy",},
{name: "Home Buoy Near Farida-B", role: "user", email: "OTH004", password:"faridaoth004b",refresh_token: null, lat: "-5.15129722222222", lng: "106.313630555556", region: "other",type: "buoy",},
{name: "Navigation Buoy of Coral Near Krisna-B", role: "user", email: "OTH005", password:"krisnaoth005b",refresh_token: null, lat: "-5.19916111111111", lng: "106.207402777778", region: "other",type: "buoy",},
{name: "Home Buoy Pabelokan", role: "user", email: "OTH006", password:"pabelokanoth006",refresh_token: null, lat: "-5.48831388888889", lng: "106.399219444444", region: "other",type: "buoy",},
{name: "Home Buoy Kitty-3", role: "user", email: "OTH007", password:"kittyoth0073",refresh_token: null, lat: "-5.52624722222222", lng: "106.186711111111", region: "other",type: "buoy",},
{name: "Navigation Buoy Cilegon No.1", role: "user", email: "OTH008", password:"cilegonoth0081",refresh_token: null, lat: "-5.92323888888889", lng: "106.116766666667", region: "other",type: "buoy",},
{name: "Navigation Buoy Cilegon No.2", role: "user", email: "OTH009", password:"cilegonoth0092",refresh_token: null, lat: "-5.89987777777778", lng: "106.121405555556", region: "other",type: "buoy",},
{name: "Navigation Buoy Cilegon No.3", role: "user", email: "OTH010", password:"cilegonoth0103",refresh_token: null, lat: "-5.86257222222222", lng: "106.140883333333", region: "other",type: "buoy",},

      // Bisa tambah data user lain di sini
    ];

    // Loop untuk create user
    for (const user of usersData) {
      let hashedPassword = null;
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(user.password, salt);
      }

      await Users.create({
        name: user.name,
        role: user.role,
        email: user.email,
        password: hashedPassword,
        refresh_token: user.refresh_token,
        lat: user.lat,
        lng: user.lng,
        region: user.region,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    console.log("Seeding multiple users selesai!");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};

export default seedUsers;
