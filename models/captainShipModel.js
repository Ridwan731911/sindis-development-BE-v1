import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const CaptainShip = db.define(
  "captain_ship",
  {
    id_captain_ship: {
      type: DataTypes.STRING(25),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
    },
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
    latitude: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    latitude_decimal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    longitude_decimal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
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
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

export default CaptainShip;
