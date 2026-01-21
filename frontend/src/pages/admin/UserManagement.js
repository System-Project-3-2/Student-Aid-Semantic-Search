/**
 * User Management Page (Admin Only)
 * Note: This is a UI placeholder since backend doesn't have user management endpoints yet
 * The actual functionality would require additional backend endpoints
 */
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Avatar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as ActiveIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { PageHeader, EmptyState } from '../../components';

// Sample user data for demonstration
// In production, this would come from a backend API
const SAMPLE_USERS = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john.student@kuet.ac.bd',
    role: 'student',
    isVerified: true,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    _id: '2',
    name: 'Jane Smith',
    email: 'jane.teacher@kuet.ac.bd',
    role: 'teacher',
    isVerified: true,
    createdAt: '2024-01-10T09:00:00Z',
  },
  {
    _id: '3',
    name: 'Bob Wilson',
    email: 'bob.student@kuet.ac.bd',
    role: 'student',
    isVerified: false,
    createdAt: '2024-01-20T14:00:00Z',
  },
  {
    _id: '4',
    name: 'Alice Johnson',
    email: 'alice.teacher@kuet.ac.bd',
    role: 'teacher',
    isVerified: true,
    createdAt: '2024-01-05T11:30:00Z',
  },
];

const UserManagement = () => {
  const [users] = useState(SAMPLE_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'verified' && user.isVerified) ||
      (statusFilter === 'unverified' && !user.isVerified);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'teacher':
        return 'secondary';
      case 'student':
        return 'primary';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  return (
    <Box>
      <PageHeader
        title="User Management"
        subtitle="Manage students and teachers in the system"
        breadcrumbs={[
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'User Management' },
        ]}
        actions={
          <Button variant="outlined" startIcon={<RefreshIcon />}>
            Refresh
          </Button>
        }
      />

      {/* Info Alert */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> This is a demonstration interface. Full user management
          functionality requires additional backend API endpoints for listing, editing,
          and managing users.
        </Typography>
      </Alert>

      {/* Filters */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <TextField
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={roleFilter}
              label="Role"
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="student">Students</MenuItem>
              <MenuItem value="teacher">Teachers</MenuItem>
              <MenuItem value="admin">Admins</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="verified">Verified</MenuItem>
              <MenuItem value="unverified">Unverified</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Users Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState
                    title="No users found"
                    description="No users match your search criteria."
                    icon={<PersonIcon sx={{ fontSize: 48 }} />}
                  />
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow
                  key={user._id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: `${getRoleColor(user.role)}.main` }}>
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography fontWeight={500}>{user.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      size="small"
                      color={getRoleColor(user.role)}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={user.isVerified ? <ActiveIcon /> : <BlockIcon />}
                      label={user.isVerified ? 'Verified' : 'Unverified'}
                      size="small"
                      color={user.isVerified ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewUser(user)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* User Details Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ pt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: `${getRoleColor(selectedUser.role)}.main`,
                    fontSize: '1.5rem',
                  }}
                >
                  {selectedUser.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedUser.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedUser.email}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Role
                  </Typography>
                  <Typography sx={{ textTransform: 'capitalize' }}>
                    {selectedUser.role}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Verification Status
                  </Typography>
                  <Typography>
                    {selectedUser.isVerified ? 'Verified' : 'Not Verified'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Joined
                  </Typography>
                  <Typography>
                    {formatDate(selectedUser.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
