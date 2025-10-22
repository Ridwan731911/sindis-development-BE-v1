import CaptainShip from "../models/captainShipModel.js";
import bcrypt from "bcrypt";

/**
 * Update only CaptainShip password
 */
export const updateCaptainShipPassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    if (!password) {
      return res.status(400).json({ msg: "Password is required" });
    }

    // Hash password baru
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [updated] = await CaptainShip.update(
      { password: hashedPassword },
      { where: { id_captain_ship: id } }
    );

    if (updated === 0) {
      return res.status(404).json({ msg: "Captain Ship not found" });
    }

    res.json({ msg: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ msg: "Server error occurred" });
  }
};
