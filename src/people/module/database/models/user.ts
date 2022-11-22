import { Model, DataTypes } from "sequelize";
import bc from "bcrypt";
import { sql } from "../../utils/db";

class User extends Model {
  declare id: number;
  declare username: string;
  declare password: string;
  declare role: string;
  declare disabled: boolean;
  declare email?: string;
  declare phone_number?: string;
  declare interests?: string;
  declare first_name?: string;
  declare last_name?: string;

  constructor() {
    super();
  }

  public comparePassword = async (password: string): Promise<boolean> => {
    return await bc.compare(password, this.password);
  };

  public getPublic = (): User => {
    const { password, ...publicUser } = this.get();
    return publicUser as User;
  };
}

User.init(
  {
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
      defaultValue: false,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    phone_number: {
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
    interests: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
  },
  {
    tableName: "users",
    sequelize: sql,
    modelName: "User",
    timestamps: true,
  }
);

export default User;
