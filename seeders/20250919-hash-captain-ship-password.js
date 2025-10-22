import bcrypt from "bcrypt";
import CaptainShip from "../models/captainShipModel.js";

const seedUsers = async () => {
 
  // Hash password CaptainShip
  const captains = await CaptainShip.findAll();
  for (let captain of captains) {
    if (captain.password && !captain.password.startsWith("$2b$")) {
      const hashed = await bcrypt.hash(captain.password, 10);
      await captain.update({ password: hashed });
      console.log(`✅ CaptainShip updated: ${captain.email}`);
    }
  }
};

export default seedUsers;
