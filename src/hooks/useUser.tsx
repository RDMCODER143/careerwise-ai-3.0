
import { useAuth } from '@/hooks/useAuth';

export const useUser = () => {
  const { profile, loading } = useAuth();
  
  return {
    user: profile,
    isLoading: loading,
  };
};
