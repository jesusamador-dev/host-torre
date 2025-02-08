import { IAuthService } from '@/domain/services/IAuthService';
import { AuthRepository } from '@/data/repositories/AuthRepository';
import { IRequestLogin } from '@/domain/repositories/IAuthRepository';

export class AuthService implements IAuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async login(request: IRequestLogin): Promise<boolean | String> {
    try {
      const token = await this.authRepository.login(request);
      if (token) {
        return token;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}
