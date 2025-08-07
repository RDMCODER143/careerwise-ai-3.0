
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface AdminUser {
  id: string;
  user_id: string;
  full_name: string;
  email?: string;
  role: string;
  app_role?: string;
  company_name?: string;
  city?: string;
  country?: string;
  is_banned?: boolean;
  banned_reason?: string;
  banned_at?: string;
  created_at: string;
  last_sign_in_at?: string;
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAuth();

  const fetchUsers = async (userType?: string) => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is admin
      if (!profile || (profile.role !== 'admin' && profile.app_role !== 'admin')) {
        throw new Error('Access denied: Admin privileges required');
      }

      let query = supabase.from('profiles').select(`
        id,
        user_id,
        full_name,
        role,
        app_role,
        company_name,
        city,
        country,
        is_banned,
        banned_reason,
        banned_at,
        created_at
      `);
      
      if (userType && userType !== 'all') {
        query = query.eq('role', userType);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match AdminUser interface
      const transformedData: AdminUser[] = (data || []).map(user => ({
        id: user.id,
        user_id: user.user_id,
        full_name: user.full_name,
        role: user.role,
        app_role: user.app_role,
        company_name: user.company_name,
        city: user.city,
        country: user.country,
        is_banned: user.is_banned,
        banned_reason: user.banned_reason,
        banned_at: user.banned_at,
        created_at: user.created_at,
        email: '', // We'll need to get this from auth.users separately if needed
        last_sign_in_at: undefined
      }));
      
      setUsers(transformedData);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const banUser = async (userId: string, reason: string) => {
    try {
      // Use the toggle_user_ban function
      const { error } = await supabase.rpc('toggle_user_ban', {
        target_user_id: userId,
        ban_reason: reason
      });

      if (error) throw error;
      
      // Refresh users list
      await fetchUsers();
      return true;
    } catch (err) {
      console.error('Error banning user:', err);
      throw err;
    }
  };

  const unbanUser = async (userId: string) => {
    try {
      // Use the toggle_user_ban function (it automatically detects current state)
      const { error } = await supabase.rpc('toggle_user_ban', {
        target_user_id: userId
      });

      if (error) throw error;
      
      // Refresh users list
      await fetchUsers();
      return true;
    } catch (err) {
      console.error('Error unbanning user:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [profile]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    banUser,
    unbanUser,
    refetch: fetchUsers
  };
};
