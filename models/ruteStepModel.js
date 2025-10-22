import { Sequelize } from "sequelize";
import db from "../config/database.js";
import RuteDestinasi from './ruteDestinasiModel.js';
import NorthRegion from "./northRegionModel.js";
import CentralRegion from "./centralRegionModel.js";
import SouthRegion from "./southRegionModel.js";
import SubseaWellhead from "./subseaWellheadModel.js";
import Conductor from "./conductorModel.js";
import TankerRigBarge from "./tankerRigBargeModel.js";
import OtherRegion from "./otherRegionModel.js";

const { DataTypes } = Sequelize;

const RuteStep = db.define(
  "rute_step",
  {
    step_id: {
      type: DataTypes.STRING(25),
      primaryKey: true,
    },
    id_rute_destinasi: {
      type: DataTypes.STRING(25),
      allowNull: false,
      references: {
        model: RuteDestinasi,
        key: "id_rute_destinasi",
      },
    },
    id_north_region: {
      type: DataTypes.STRING(25),
      allowNull: true,
      references: {
        model: NorthRegion,
        key: "id_north_region",
      },
    },
    id_central_region: {
      type: DataTypes.STRING(25),
      allowNull: true,
      references: {
        model: CentralRegion,
        key: "id_central_region",
      },
    },
    id_south_region: {
      type: DataTypes.STRING(25),
      allowNull: true,
      references: {
        model: SouthRegion,
        key: "id_south_region",
      },
    },
    id_subsea_wellhead: {
      type: DataTypes.STRING(25),
      allowNull: true,
      references: {
        model: SubseaWellhead,
        key: "id_subsea_wellhead",
      },
    },
    id_conductor: {
      type: DataTypes.STRING(25),
      allowNull: true,
      references: {
        model: Conductor,
        key: "id_conductor",
      },
    },
    id_tanker_rig_barge: {
      type: DataTypes.STRING(25),
      allowNull: true,
      references: {
        model: TankerRigBarge,
        key: "id_tanker_rig_barge",
      },
    },
    id_other_region: {
      type: DataTypes.STRING(25),
      allowNull: true,
      references: {
        model: OtherRegion,
        key: "id_other_region",
      },
    },
    step_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    statusStep: {
      type: DataTypes.ENUM("approved", "inprogress"),
      defaultValue: "approved",
    },
  },
  {
    freezeTableName: true, // Nama tabel tetap "rute_step"
  }
);

// Relationship
RuteStep.belongsTo(RuteDestinasi, { foreignKey: "id_rute_destinasi", as: "rute" });
RuteDestinasi.hasMany(RuteStep, { foreignKey: "id_rute_destinasi", as: "steps" });
RuteStep.belongsTo(NorthRegion, { foreignKey: "id_north_region", as: "northRegion" });
RuteStep.belongsTo(CentralRegion, { foreignKey: "id_central_region", as: "centralRegion" });
RuteStep.belongsTo(SouthRegion, { foreignKey: "id_south_region", as: "southRegion" });
RuteStep.belongsTo(SubseaWellhead, { foreignKey: "id_south_region", as: "subseaWellhead" });
RuteStep.belongsTo(Conductor, { foreignKey: "id_south_region", as: "conductor" });
RuteStep.belongsTo(TankerRigBarge, { foreignKey: "id_south_region", as: "tankerRigBarge" });
RuteStep.belongsTo(OtherRegion, { foreignKey: "id_south_region", as: "otherRegion" });

export default RuteStep;
