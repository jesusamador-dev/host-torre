import { AuthService } from '@/data/services/AuthService';
import { AuthRepository } from '@/data/repositories/AuthRepository';
import { IRequestLogin } from '@/domain/repositories/IAuthRepository';

// Mock de AuthRepository
jest.mock('@/data/repositories/AuthRepository');

describe('AuthService', () => {
  let authService: AuthService;
  let mockAuthRepository: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    mockAuthRepository = new AuthRepository() as jest.Mocked<AuthRepository>;
    authService = new AuthService(mockAuthRepository); // Inyectamos el mock en AuthService
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a token when login is successful', async () => {
    // Datos de prueba
    const mockRequest: IRequestLogin = { numEmpleado: '123', perfilId: '456' };
    const mockToken = 'mockToken';

    // Simular el éxito del login en AuthRepository
    mockAuthRepository.login.mockResolvedValueOnce(mockToken);

    // Llamar a la función login de AuthService
    const result = await authService.login(mockRequest);

    // Verificaciones
    expect(mockAuthRepository.login).toHaveBeenCalledWith(mockRequest);
    expect(result).toBe(mockToken);
  });

  it('should return false if login fails to get a token', async () => {
    // Datos de prueba
    const mockRequest: IRequestLogin = { numEmpleado: '123', perfilId: '456' };

    // Simular que no se obtiene token
    mockAuthRepository.login.mockResolvedValueOnce('');

    // Llamar a la función login de AuthService
    const result = await authService.login(mockRequest);

    // Verificaciones
    expect(mockAuthRepository.login).toHaveBeenCalledWith(mockRequest);
    expect(result).toBe(false);
  });

  it('should return true if there is an exception during login', async () => {
    // Datos de prueba
    const mockRequest: IRequestLogin = { numEmpleado: '123', perfilId: '456' };

    // Simular un error al intentar hacer login
    mockAuthRepository.login.mockRejectedValueOnce(new Error('Network Error'));

    // Llamar a la función login de AuthService
    const result = await authService.login(mockRequest);

    // Verificaciones
    expect(mockAuthRepository.login).toHaveBeenCalledWith(mockRequest);
    expect(result).toBe(true);
  });
});
