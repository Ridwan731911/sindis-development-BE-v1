import { Sequelize } from "sequelize";
import db from "../config/database.js";
import ShipRequest from "./shipRequestModel.js";

const { DataTypes } = Sequelize;

const FreshWaterRequest = db.define(
  "fresh_water_request",
  {
    fresh_water_request_id: {
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
    volume_fresh_water: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    satuan_ukur: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    freezeTableName: true, // nama tabel tetap "fresh_water_request"
  }
);

// Relationships with ShipRequest
FreshWaterRequest.belongsTo(ShipRequest, { foreignKey: "ship_request_id", as: "shipRequest" });
ShipRequest.hasMany(FreshWaterRequest, { foreignKey: "ship_request_id", as: "freshWaterRequests" });

export default FreshWaterRequest;
