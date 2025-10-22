import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Island = db.define(
  "island",
  {
    id_island: {
      type: DataTypes.STRING(25),
      primaryKey: true,
    },
    island_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
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
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
  },
  {
    freezeTableName: true,
  }
);

export default Island;
