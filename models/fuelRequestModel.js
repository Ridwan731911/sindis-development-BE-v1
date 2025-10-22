import { Sequelize } from "sequelize";
import db from "../config/database.js";
import ShipRequest from "./shipRequestModel.js";

const { DataTypes } = Sequelize;

const FuelRequest = db.define(
  "fuel_request",
  {
    fuel_request_id: {
      type: DataTypes.STRING(25),
      primaryKey: true,
    },
    ship_request_id: {
      type: DataTypes.STRING(25),
      allowNull: false,
      references: {
        model: ShipRequest,
        key: "ship_request_id",
      },
    },
    jenis_fuel: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    jenis_material: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    kuantiti: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    satuan_ukur: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

// Relasi
FuelRequest.belongsTo(ShipRequest, { foreignKey: "ship_request_id", as: "shipRequest" });
ShipRequest.hasMany(FuelRequest, { foreignKey: "ship_request_id", as: "fuelRequests" });

export default FuelRequest;
