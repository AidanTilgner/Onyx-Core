import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import bc from "bcrypt";
import { db } from "../../utils/db";

const definition = {
  columns: {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    role: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    phone_number: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    interests: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    first_name: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    last_name: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
  },
  config: {
    tableName: "users",
    modelName: "User",
    timestamps: true,
    freezeTableName: true,
  },
};
export default class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare username: string;
  declare password: string;
  declare role: string;
  declare disabled: boolean;
  declare email: string | null;
  declare phone_number: string | null;
  declare interests: string | null;
  declare first_name: string | null;
  declare last_name: string | null;

  public comparePassword = async (password: string): Promise<boolean> => {
    return await bc.compare(password, this.password);
  };

  public getPublic = (): Partial<User> => {
    const { password, ...publicUser } = this.toJSON();
    return publicUser;
  };
}

export const initUsers = async () => {
  const user = User.init(definition.columns, {
    ...definition.config,
    sequelize: db.sequelize,
  });
  return user;
};
