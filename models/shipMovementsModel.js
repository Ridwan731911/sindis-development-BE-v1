import { Sequelize } from "sequelize";
import db from "../config/database.js";
import CaptainShip from "./captainShipModel.js";

const { DataTypes } = Sequelize;

const ShipMovement = db.define(
  "ship_movements",
  {
    id_ship_movements: {
        type: DataTypes.STRING(25),
        primaryKey: true,
    },
    id_captain_ship: {
      type: DataTypes.STRING(25),
      references: {
        model: CaptainShip,
        key: "id_captain_ship",
      },
    },
    name: {
      type: DataTypes.STRING(255),
    },
    lat: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    lng: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

ShipMovement.belongsTo(CaptainShip, { foreignKey: "id_captain_ship", as: "captain" });
CaptainShip.hasMany(ShipMovement, { foreignKey: "id_captain_ship", as: "movements" });


export default ShipMovement;
