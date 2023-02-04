import { db } from "people/module/utils/db";
import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

const definition = {
  columns: {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    content: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    // user foreign key
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  config: {
    tableName: "notes",
    modelName: "Note",
    timestamps: true,
    freezeTableName: true,
  },
};

export default class Note extends Model<
  InferAttributes<Note>,
  InferCreationAttributes<Note>
> {
  declare title: string;
  declare content: string;
  declare userId: number;
}

export const initNotes = async () => {
  const note = Note.init(definition.columns, {
    ...definition.config,
    sequelize: db.sequelize,
  });
  return note;
};
