import { Sequelize } from "sequelize";
import db from "../config/database.js";
import ShipPosition from "./shipPositionModel.js";
import Users from "./userModel.js";

const { DataTypes } = Sequelize;
const ShipRequest = db.define(
  "ship_request",
  {
    ship_request_id: {
      type: DataTypes.STRING(25),
      primaryKey: true,
    },
    ship_position_id: {
      type: DataTypes.INTEGER,
      references: {
        model: ShipPosition,
        key: "ship_position_id",
      },
    },
    id: {
      type: DataTypes.INTEGER,
      references: {
        model: Users,
        key: "id",
      }
    },
    tanggal_request: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    kordinat_request: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lat_request: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lng_request: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    kategori_request: {
      type: DataTypes.ENUM(
        "fuel",
        "fresh_water",
        "passenger",
        "material",
        "foodstuff"
      ),
      allowNull: false,
    },
    status_request: {
      type: DataTypes.ENUM(
        "waiting approval",
        "process to fleet team",
        "approved",
        "rejected"
      ),
      defaultValue: "waiting approval",
    },
    fleet_status: {
      type: DataTypes.ENUM(
        "pending",
        "process",
        "delivered",
        "complete"
      ),
      defaultValue: "pending",
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    jenis_material: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    kuantitas: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    satuan: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    priority_request: {
      type: DataTypes.STRING, // bisa "normal" / "priority"
      defaultValue: "normal",
    },
    admin_note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    priority_level: {
      type: DataTypes.ENUM(
        "normal",
        "urgent",
        "emergency"
      ),
      defaultValue: "normal",
    },
    destination_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

// Relationships with ShipPosition
ShipRequest.belongsTo(ShipPosition, {
  foreignKey: "ship_position_id",
  as: "position",
});
ShipPosition.hasMany(ShipRequest, {
  foreignKey: "ship_position_id",
  as: "requests",
});

// Relationships with Users
ShipRequest.belongsTo(Users, { foreignKey: "id", as: "user" });
Users.hasMany(ShipRequest, { foreignKey: "id", as: "requests" });

export default ShipRequest;
