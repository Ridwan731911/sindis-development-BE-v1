import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Fuel = db.define("fuel", {
    fuel_id: {
        type: DataTypes.STRING(25),
        primaryKey: true,
        allowNull: false
    },
    type_fuel: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    material_fuel: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    volume_tersedia_fuel: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    satuan_ukur_fuel: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    status_fuel: {
        type: DataTypes.ENUM("aktif", "nonaktif"),
        defaultValue: "aktif"
    }
}, {
    freezeTableName: true
});

export default Fuel;
