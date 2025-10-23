import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum TODO {
  WHATSAPP = 'WHATSAPP',
  NEEDCARD = 'NEEDCARD',
  NEEDPRESENT = 'NEEDPRESENT',
}

@Entity()
export class Birthday {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  dateOfBirth: string | null;

  @Column({
    type: 'enum',
    enum: TODO,
    default: TODO.NEEDPRESENT,
  })
  Todo: TODO;
}
