import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BcryptUtils } from '../../common/utils/bcrypt.util';
import { User } from 'src/db/entities/user.entity';
import { Role } from 'src/db/entities/role.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    if (createUserDto.password) {
      const isPasswordStrong = await BcryptUtils.validatePasswordStrength(
        createUserDto.password,
      );
      if (!isPasswordStrong) {
        throw new BadRequestException(
          'Password is not strong enough. It must contain at least 8 characters, including uppercase, lowercase, number and special character.',
        );
      }
    }

    const user = this.usersRepository.create(createUserDto);

    if (createUserDto.roleIds && createUserDto.roleIds.length > 0) {
      const roles = await this.rolesRepository.findByIds(createUserDto.roleIds);
      user.roles = roles;
    }

    const savedUser = await this.usersRepository.save(user);
    this.logger.log(`User created: ${savedUser.email}`);

    const { password, ...result } = savedUser;
    return result as User;
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find({
      relations: ['roles', 'roles.permissions', 'roles.permissions.section'],
    });

    return users.map((user) => {
      const { password, ...result } = user;
      return result as User;
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions', 'roles.permissions.section'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...result } = user;
    return result as User;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['roles', 'roles.permissions', 'roles.permissions.section'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    if (updateUserDto.password) {
      const isPasswordStrong = await BcryptUtils.validatePasswordStrength(
        updateUserDto.password,
      );
      if (!isPasswordStrong) {
        throw new BadRequestException(
          'Password is not strong enough. It must contain at least 8 characters, including uppercase, lowercase, number and special character.',
        );
      }
    }

    if (updateUserDto.roleIds) {
      const roles = await this.rolesRepository.findByIds(updateUserDto.roleIds);
      user.roles = roles;
    }

    const updatedUser = await this.usersRepository.save({
      ...user,
      ...updateUserDto,
    });

    this.logger.log(`User updated: ${updatedUser.email}`);

    const { password, ...result } = updatedUser;
    return result as User;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.softRemove(user);
    this.logger.log(`User deleted: ${user.email}`);
  }

  async deactivate(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = false;
    const deactivatedUser = await this.usersRepository.save(user);
    this.logger.log(`User deactivated: ${deactivatedUser.email}`);

    const { password, ...result } = deactivatedUser;
    return result as User;
  }

  async activate(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = true;
    const activatedUser = await this.usersRepository.save(user);
    this.logger.log(`User activated: ${activatedUser.email}`);

    const { password, ...result } = activatedUser;
    return result as User;
  }
}
