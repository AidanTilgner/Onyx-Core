import { db } from "people/module/utils/db";
import { Model, DataTypes, Sequelize } from "sequelize";

class Token extends Model {
  declare id: number;
  declare value: string;
  declare key: string;
}

export const definition = {
  columns: {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    value: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    key: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
  },
  config: {
    tableName: "reset_token",
    modelName: "Token",
    timestamps: true,
  },
};

export const initTokens = async () => {
  Token.init(definition.columns, {
    ...definition.config,
    sequelize: db.sequelize,
    freezeTableName: true,
  });
};

export default Token;
