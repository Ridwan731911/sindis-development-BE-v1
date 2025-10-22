import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Passenger = db.define("passenger", {
    passenger_id: {
        type: DataTypes.STRING(25),
        primaryKey: true,
        allowNull: false
    },
    type_passenger: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    jumlah_passenger_tesedia: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status_passenger: {
        type: DataTypes.ENUM("aktif", "nonaktif"),
        defaultValue: "aktif"
    }
}, {
    freezeTableName: true
});

export default Passenger;
