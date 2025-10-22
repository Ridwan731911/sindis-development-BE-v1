// models/shipPositionModel.js
import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const ShipPosition = db.define(
  "ship_positions",
  {
    ship_position_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    mmsi: DataTypes.STRING,
    name: DataTypes.STRING,
     role: {
      type: DataTypes.ENUM(
        "admin",
        "fuel",
        "fw",
        "passenger",
        "fleet",
        "captain",
        "spv",
        "user"
      ),
      defaultValue: "user",
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lat: DataTypes.FLOAT,
    lon: DataTypes.FLOAT,
    type: {
      type: DataTypes.ENUM(
        "platform",
        "buoy",
        "ship",
        "subsea_wellhead",
        "conductor",
        "tanker",
        "rig",
        "barge",
        "island",
      ),
      allowNull: false,
      defaultValue: "ship",
    },
    region: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    speed: DataTypes.FLOAT,
    heading: DataTypes.INTEGER,
    port: DataTypes.STRING,
    date: DataTypes.DATE,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

export default ShipPosition;
