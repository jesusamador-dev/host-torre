import {AuthService} from '@/data/services/AuthService';
import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
// sonar-ignore
import useAuthStore from 'mf_mesacyc_dashboards_common/useAuthStore';

const TokenAuth: React.FC = () => {
  const {token} = useParams<{token: string}>();
  const navigate = useNavigate();
  const [isLogged, setIsLogged] = useState<boolean | null>(null);
  const { setToken } = useAuthStore();
  const authService = new AuthService();

  const decodeToken = async (tokenParam: string) => {
    try {
      const data = JSON.parse(atob(tokenParam));
      const keys = Object.keys(data);
      if (!keys.includes('deptoId') || !keys.includes('numEmpleado') || !keys.includes('perfilId')) {
        setIsLogged(false);
        return;
      }
      const result = await authService.login({
        numEmpleado: data['numEmpleado'].toString(),
        perfilId: data['perfilId'].toString(),
      });
      
      if (!result) {
        setIsLogged(false);
        return;
      }

      setToken(result);
      setIsLogged(true);
    } catch (error) {
      setIsLogged(false);
    }
  };

  useEffect(() => {
    if (token) {
      decodeToken(token);
    } else {
      setIsLogged(false);
    }
  }, [token]);

  useEffect(() => {
    if (isLogged !== null) {
      if (isLogged) {
        navigate('/solicitudes/');
      } else {
        navigate('/error/');
      }
    }
  }, [isLogged, navigate]);

  return null;
};

export default TokenAuth;