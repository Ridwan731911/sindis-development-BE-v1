import { Sequelize } from "sequelize";
import db from "../config/database.js";
import ShipRequest from "./shipRequestModel.js";

const { DataTypes } = Sequelize;

const RuteDestinasi = db.define(
  "rute_destinasi",
  {
    id_rute_destinasi: {
      type: DataTypes.STRING(25),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    ship_request_id: {
      type: DataTypes.STRING(25),
      allowNull: false,
      references: {
        model: ShipRequest,
        key: "ship_request_id", 
      },
    },
    tanggal_keberangkatan: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    nama_rute: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    jarak_tempuh: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    est_waktu_tempuh: {
      type: DataTypes.STRING(50), 
      allowNull: false,
    },
    kecepatan_knoot: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    konsumsi_fuel: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    satuan_konsumsi: {
      type: DataTypes.ENUM("KL", "L", "Ton"),
      allowNull: false,
    },
    los_fuel_summary: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    satuan_los_fuel_summary: {
      type: DataTypes.ENUM("KL", "L", "Ton"),
      allowNull: true,
    },
    status_rute: {
      type: DataTypes.ENUM("sesuai rute", "perubahan rute"),
      allowNull: false,
      defaultValue: "sesuai rute",
    },
    catatan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    alasan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    visited_requests: {
      type: DataTypes.TEXT, // bisa panjang (JSON.stringify array of IDs)
      allowNull: true,
      get() {
        const raw = this.getDataValue("visited_requests");
        return raw ? JSON.parse(raw) : [];
      },
      set(value) {
        this.setDataValue("visited_requests", JSON.stringify(value));
      },
    },
  },
  {
    freezeTableName: true, 
  }
);

// Relationships
RuteDestinasi.belongsTo(ShipRequest, {
  foreignKey: "ship_request_id",
  as: "shipRequest",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

ShipRequest.hasMany(RuteDestinasi, {
  foreignKey: "ship_request_id",
  as: "ruteDestinasi",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

export default RuteDestinasi;
