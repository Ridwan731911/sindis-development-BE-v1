import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const SubseaWellhead = db.define(
  "subsea_wellhead",
  {
    id_subsea_wellhead: {
      type: DataTypes.STRING(25),
      primaryKey: true,
    },
    platform_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    latitude: {
      type: DataTypes.STRING(50),
      allowNull: true, // format DMS
    },
    longitude: {
      type: DataTypes.STRING(50),
      allowNull: true, // format DMS
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

export default SubseaWellhead;
