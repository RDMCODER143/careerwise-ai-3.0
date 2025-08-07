
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, Ban, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  user_id: string;
  full_name: string;
  role: string;
  app_role?: string;
  company_name?: string;
  city?: string;
  country?: string;
  is_banned?: boolean;
  banned_reason?: string;
  created_at: string;
}

interface AdminUsersTableProps {
  userType: 'job_seeker' | 'employer' | 'all';
}

export default function AdminUsersTable({ userType }: AdminUsersTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [banReason, setBanReason] = useState("");
  const [showBanDialog, setShowBanDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, [userType]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
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
        created_at
      `);
      
      if (userType !== 'all') {
        query = query.eq('role', userType);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (user: User) => {
    setSelectedUser(user);
    setBanReason(user.banned_reason || "");
    setShowBanDialog(true);
  };

  const confirmBanAction = async () => {
    if (!selectedUser) return;
    
    try {
      const isBanning = !selectedUser.is_banned;
      
      // Use the toggle_user_ban function
      const { error } = await supabase.rpc('toggle_user_ban', {
        target_user_id: selectedUser.user_id,
        ban_reason: isBanning ? banReason : null
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `User ${isBanning ? 'banned' : 'unbanned'} successfully`,
      });
      
      setShowBanDialog(false);
      setBanReason("");
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user ban:', error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-red-400" />
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-red-200 focus:border-red-400"
        />
      </div>

      {/* Table */}
      <div className="border border-red-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-red-50">
            <TableRow>
              <TableHead className="text-red-900">Name</TableHead>
              <TableHead className="text-red-900">Role</TableHead>
              <TableHead className="text-red-900">Company</TableHead>
              <TableHead className="text-red-900">Location</TableHead>
              <TableHead className="text-red-900">Status</TableHead>
              <TableHead className="text-red-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-red-50">
                <TableCell className="font-medium">{user.full_name}</TableCell>
                <TableCell>
                  <Badge 
                    variant={user.role === 'employer' ? 'default' : 'secondary'}
                    className={user.role === 'employer' ? 'bg-red-100 text-red-800' : ''}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{user.company_name || '-'}</TableCell>
                <TableCell>{user.city && user.country ? `${user.city}, ${user.country}` : '-'}</TableCell>
                <TableCell>
                  <Badge 
                    variant={user.is_banned ? 'destructive' : 'default'}
                    className={user.is_banned ? 'bg-red-600 text-white' : 'bg-green-100 text-green-800'}
                  >
                    {user.is_banned ? 'Banned' : 'Active'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant={user.is_banned ? "default" : "destructive"}
                    size="sm"
                    onClick={() => handleBanUser(user)}
                    className={user.is_banned 
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "bg-red-600 hover:bg-red-700"
                    }
                  >
                    {user.is_banned ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Unban
                      </>
                    ) : (
                      <>
                        <Ban className="h-4 w-4 mr-1" />
                        Ban
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Ban/Unban Dialog */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent className="border-red-200">
          <DialogHeader>
            <DialogTitle className="text-red-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              {selectedUser?.is_banned ? 'Unban User' : 'Ban User'}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.is_banned 
                ? `Are you sure you want to unban ${selectedUser?.full_name}?`
                : `Are you sure you want to ban ${selectedUser?.full_name}? This will prevent them from accessing the platform.`
              }
            </DialogDescription>
          </DialogHeader>
          
          {!selectedUser?.is_banned && (
            <div className="space-y-2">
              <label htmlFor="ban-reason" className="text-sm font-medium text-red-900">
                Reason for ban (required)
              </label>
              <Textarea
                id="ban-reason"
                placeholder="Enter the reason for banning this user..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                className="border-red-200 focus:border-red-400"
              />
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBanDialog(false)}>
              Cancel
            </Button>
            <Button
              variant={selectedUser?.is_banned ? "default" : "destructive"}
              onClick={confirmBanAction}
              disabled={!selectedUser?.is_banned && !banReason.trim()}
              className={selectedUser?.is_banned 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-red-600 hover:bg-red-700"
              }
            >
              {selectedUser?.is_banned ? 'Unban User' : 'Ban User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
