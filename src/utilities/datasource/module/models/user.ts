import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Interest } from "./interest";
import { Note } from "./note";
import { comparePassword } from "../utils/crypto";
import { UserRoles } from "docs/users";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  username!: string;

  @Column("text", {
    unique: true,
    nullable: true,
  })
  email!: string;

  @Column("text")
  password!: string;

  @Column("text", {
    default: "user",
  })
  role!: UserRoles;

  @Column("boolean", {
    default: false,
  })
  disabled!: boolean;

  @Column("text", {
    nullable: true,
    unique: true,
  })
  phone_number!: string;

  @Column("text", {
    nullable: true,
  })
  first_name!: string;

  @Column("text", {
    nullable: true,
  })
  last_name!: string;

  @OneToMany(() => Interest, (interest) => interest.user)
  interests!: Interest[];

  @OneToMany(() => Note, (note) => note.user)
  notes!: Note[];

  public getPublic() {
    const { password, ...rest } = this;
    return rest;
  }

  static describe() {
    const fields = [
      "username",
      "email",
      "role",
      "disabled",
      "phone_number",
      "first_name",
      "last_name",
    ];
    return fields;
  }

  public async comparePassword(password: string) {
    return comparePassword(password, this.password);
  }
}
