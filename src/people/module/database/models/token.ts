import { db } from "people/module/utils/db";
import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

export const definition = {
  columns: {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    value: {
      type: new DataTypes.TEXT("medium"),
      allowNull: false,
    },
    key: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
  },
  config: {
    tableName: "reset_tokens",
    modelName: "Token",
    timestamps: true,
    freezeTableName: true,
  },
};

export default class Token extends Model<
  InferAttributes<Token>,
  InferCreationAttributes<Token>
> {
  declare value: string;
  declare key: string;
}

export const initTokens = async () => {
  const token = Token.init(definition.columns, {
    ...definition.config,
    sequelize: db.sequelize,
  });
  return token;
};
