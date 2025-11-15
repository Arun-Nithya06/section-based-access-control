import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Permission } from './permission.entity';

@Entity('sections')
export class Section extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  path: string;

  @OneToMany(() => Permission, (permission) => permission.section, {
    cascade: true,
  })
  permissions: Permission[];
}
