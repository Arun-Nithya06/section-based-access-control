import * as bcrypt from 'bcrypt';

export class BcryptUtils {
  private static readonly SALT_ROUNDS = 12;

  static async hashPassword(password: string): Promise<string> {
    if (!password) throw new Error('hashPassword: password is required');
    const hashed = await bcrypt.hash(password, this.SALT_ROUNDS);
    return hashed;
  }

  static async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    if (!password || !hashedPassword) {
      console.log('[BcryptUtils] comparePassword: missing input');
      return false;
    }
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  }

  static async validatePasswordStrength(password: string): Promise<boolean> {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const result = strongPasswordRegex.test(password);
    console.log('[BcryptUtils] Password strength valid:', result);
    return result;
  }
}
