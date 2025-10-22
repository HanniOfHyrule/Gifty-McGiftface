import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Birthday {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column()
  dateOfBirth: Date;

  @Column()
  Todo: TODO;
}

enum TODO {
  WHATSAPP = 'WHATSAPP',
  NEEDCARD = 'NEEDCARD',
  NEEDPRESENT = 'NEEDPRESENT',
}
