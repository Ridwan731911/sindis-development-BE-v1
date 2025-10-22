import {Sequelize} from "sequelize";
import db from "../config/database.js";

const {
    DataTypes
} = Sequelize;

const FreshWater = db.define('fresh_water', {
    fresh_water_id: {
        type: DataTypes.STRING(25),
        primaryKey: true,
        allowNull: false
    },
    volume_tersedia_fresh_water: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    satuan_ukur_fresh_water: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    status_fresh_water: {
        type: DataTypes.ENUM('aktif', 'nonaktif'),
        defaultValue: 'aktif'
    }
}, {
    freezeTableName: true
});

export default FreshWater;