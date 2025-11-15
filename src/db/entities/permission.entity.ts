import { Entity, Column, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Role } from './role.entity';
import { Section } from './section.entity';
import { PermissionAction } from 'src/common/enums/permission-action.enum';

@Entity('permissions')
@Unique(['role', 'section'])
export class Permission extends BaseEntity {
  @ManyToOne(() => Role, (role) => role.permissions, { onDelete: 'CASCADE' })
  role: Role;

  @ManyToOne(() => Section, (section) => section.permissions, {
    onDelete: 'CASCADE',
    eager: true,
  })
  section: Section;

  @Column({
    type: 'enum',
    enum: PermissionAction,
    array: true,
    default: [],
  })
  actions: PermissionAction[];
}
