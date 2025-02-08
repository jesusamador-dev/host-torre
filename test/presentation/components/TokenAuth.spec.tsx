import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TokenAuth from '../../../src/presentation/components/TokenAuth';
import { AuthService } from '../../../src/data/services/AuthService';
import { useParams, useNavigate } from 'react-router-dom';
import useAuthStore from 'mf_mesacyc_dashboards_common/useAuthStore';

// Mocking the dependencies
jest.mock('../../../src/data/services/AuthService');
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));
jest.mock('mf_mesacyc_dashboards_common/useAuthStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    setToken: jest.fn(),  // Mock de la función setToken
  })),
}));

describe('TokenAuth Component', () => {
  let mockSetToken: jest.Mock;
  let mockLogin: jest.Mock;
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    mockSetToken = jest.fn();
    mockLogin = jest.fn();
    mockNavigate = jest.fn();

    (useAuthStore as jest.Mock).mockReturnValue({
      setToken: mockSetToken,
    });

    (useParams as jest.Mock).mockReturnValue({ token: 'validToken' });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    (AuthService as jest.Mock).mockImplementation(() => ({
      login: mockLogin,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should decode token and login successfully', async () => {
    const validDecodedToken = {
      deptoId: '123',
      numEmpleado: '456',
      perfilId: '789',
    };
    mockLogin.mockResolvedValue('mockToken');
    jest.spyOn(global, 'atob').mockReturnValue(JSON.stringify(validDecodedToken));

    render(<TokenAuth />);

    await waitFor(() => {
      expect(mockSetToken).toHaveBeenCalledWith('mockToken');
      expect(mockNavigate).toHaveBeenCalledWith('/solicitudes/');
    });
  });

  it('should navigate to error page for invalid token', async () => {
    jest.spyOn(global, 'atob').mockImplementation(() => {
      throw new Error('Invalid token');
    });

    render(<TokenAuth />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/error/');
    });
  });

  it('should navigate to error page if token is missing required fields', async () => {
    const invalidDecodedToken = {
      numEmpleado: '456',
    };
    jest.spyOn(global, 'atob').mockReturnValue(JSON.stringify(invalidDecodedToken));

    render(<TokenAuth />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/error/');
    });
  });
});