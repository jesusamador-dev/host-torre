import { AuthRepository } from '@/data/repositories/AuthRepository';
import axios from 'mf_mesacyc_dashboards_common/axios';

// Mock de axios
jest.mock('mf_mesacyc_dashboards_common/axios', () => ({
  get: jest.fn(),
}));

describe('AuthRepository', () => {
  let authRepository: AuthRepository;

  beforeEach(() => {
    authRepository = new AuthRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return token when login is successful', async () => {
    // Datos de prueba
    const mockRequest = { numEmpleado: '123', perfilId: '456' };
    const mockResponse = { data: [{ token: 'mockToken' }] };

    // Simulación de axios
    (axios.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    // Llamada a la función login
    const result = await authRepository.login(mockRequest);

    // Verificaciones
    expect(axios.get).toHaveBeenCalledWith(
      'https://66c692ac134eb8f43497e58f.mockapi.io/v1/token',
      mockRequest
    );
    expect(result).toBe('mockToken');
  });

  it('should throw an error when login fails', async () => {
    // Simulación de un error de axios
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    // Datos de prueba
    const mockRequest = { numEmpleado: '123', perfilId: '456' };

    // Verificación de que se lanza un error
    await expect(authRepository.login(mockRequest)).rejects.toThrow('Network Error');
  });
});
