import {
  Injectable,
  UnauthorizedException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { BcryptUtils } from '../../common/utils/bcrypt.util';
import { User } from 'src/db/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { email } });

    console.log('Loaded User:', user);

    if (!user) return null;

    console.log(
      'Password compare:',
      await BcryptUtils.comparePassword(password, user.password),
    );

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const payload = {
      email: user.email,
      sub: user.id,
    };

    this.logger.log(`User logged in: ${user.email}`);

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        roles: user.roles,
        permissions: this.getUserPermissions(user),
      },
    };
  }

  async logout(userId: string) {
    this.logger.log(`User logged out: ${userId}`);
    return { message: 'Logged out successfully' };
  }

  async refreshToken(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      roles: user.roles,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isCurrentPasswordValid = await BcryptUtils.comparePassword(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const isNewPasswordStrong = await BcryptUtils.validatePasswordStrength(
      newPassword,
    );
    if (!isNewPasswordStrong) {
      throw new BadRequestException('New password is not strong enough');
    }

    user.password = newPassword;
    await this.usersRepository.save(user);

    this.logger.log(`Password changed for user: ${user.email}`);
    return { message: 'Password changed successfully' };
  }

  private getUserPermissions(user: User): string[] {
    const permissions: string[] = [];

    user.roles?.forEach((role) => {
      role.permissions?.forEach((permission) => {
        permission.actions.forEach((action) => {
          permissions.push(`${permission.section.name}:${action}`);
        });
      });
    });

    return [...new Set(permissions)];
  }
}
