import { sql } from "people/module/utils/db";
import { Model, DataTypes } from "sequelize";

class Token extends Model {
  declare id: number;
  declare value: string;
  declare key: string;
}

Token.init(
  {
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
  {
    tableName: "reset_token",
    sequelize: sql,
    modelName: "Token",
    timestamps: true,
  }
);

export default Token;
