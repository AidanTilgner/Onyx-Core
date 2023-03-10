import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Interest } from "./interest";
import { Note } from "./note";
import { comparePassword } from "../../utils/crypto";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column({
    unique: true,
    nullable: true,
  })
  email!: string;

  @Column()
  password!: string;

  @Column({
    default: "user",
  })
  role!: string;

  @Column({
    default: false,
  })
  disabled!: boolean;

  @Column({
    nullable: true,
    unique: true,
  })
  phone_number!: string;

  @Column({
    nullable: true,
  })
  first_name!: string;

  @Column({
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
    return await comparePassword(password, this.password);
  }
}
