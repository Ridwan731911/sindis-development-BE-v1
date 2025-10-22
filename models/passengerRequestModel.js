import { Sequelize } from "sequelize";
import db from "../config/database.js";
import ShipRequest from "./shipRequestModel.js";

const { DataTypes } = Sequelize;

const PassengerRequest = db.define(
  "passenger_request",
  {
    passenger_request_id: {
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
    jumlah_passenger: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deskripsi: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

// Relationships with ShipRequest
PassengerRequest.belongsTo(ShipRequest, { foreignKey: "ship_request_id", as: "shipRequest" });
ShipRequest.hasMany(PassengerRequest, { foreignKey: "ship_request_id", as: "passengerRequests" });

export default PassengerRequest;
