import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Users = db.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
        "user",
        "superadmin",
        "ipb"
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
    lat: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    lng: {
      type: DataTypes.STRING(100),
      allowNull: true,
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
  },
  {
    freezeTableName: true,
  }
);

export default Users;
