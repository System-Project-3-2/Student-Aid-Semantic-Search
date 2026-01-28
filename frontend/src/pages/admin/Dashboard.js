/**
 * Admin Dashboard
 * System overview with key statistics
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Typography, Paper, Button } from '@mui/material';
import {
  People as PeopleIcon,
  Feedback as FeedbackIcon,
  CheckCircle as ResolvedIcon,
  HourglassEmpty as PendingIcon,
  CloudUpload as UploadIcon,
  Search as SearchIcon,
  School as StudentIcon,
  Work as TeacherIcon,
} from '@mui/icons-material';
import { PageHeader, StatCard, LoadingSpinner, EmptyState } from '../../components';
import { useAuth } from '../../hooks';
import { feedbackService, adminService } from '../../services';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalFeedbacks: 0,
    pending: 0,
    resolved: 0,
  });
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    students: 0,
    teachers: 0,
    admins: 0,
  });
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch feedbacks
      const feedbacks = await feedbackService.getAllFeedbacks();
      
      const pending = feedbacks.filter((f) => f.status === 'pending').length;
      const resolved = feedbacks.filter((f) => f.status === 'resolved').length;
      
      setStats({
        totalFeedbacks: feedbacks.length,
        pending,
        resolved,
      });
      
      setRecentFeedbacks(feedbacks.slice(0, 5));

      // Fetch user stats
      const userStatsData = await adminService.getUserStats();
      setUserStats(userStatsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <Box>
      <PageHeader
        title={`Welcome, ${user?.name}!`}
        subtitle="System Administration Dashboard"
        actions={
          <Button
            variant="contained"
            startIcon={<PeopleIcon />}
            onClick={() => navigate('/admin/users')}
          >
            Manage Users
          </Button>
        }
      />

      {/* User Stats Grid */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        User Overview
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={userStats.totalUsers}
            icon={<PeopleIcon fontSize="large" />}
            color="primary.main"
            onClick={() => navigate('/admin/users')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Students"
            value={userStats.students}
            icon={<StudentIcon fontSize="large" />}
            color="info.main"
            onClick={() => navigate('/admin/users')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Teachers"
            value={userStats.teachers}
            icon={<TeacherIcon fontSize="large" />}
            color="secondary.main"
            onClick={() => navigate('/admin/users')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Admins"
            value={userStats.admins}
            icon={<PeopleIcon fontSize="large" />}
            color="error.main"
            onClick={() => navigate('/admin/users')}
          />
        </Grid>
      </Grid>

      {/* Feedback Stats Grid */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Feedback Overview
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Feedbacks"
            value={stats.totalFeedbacks}
            icon={<FeedbackIcon fontSize="large" />}
            color="primary.main"
            onClick={() => navigate('/admin/feedbacks')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<PendingIcon fontSize="large" />}
            color="warning.main"
            onClick={() => navigate('/admin/feedbacks')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Resolved"
            value={stats.resolved}
            icon={<ResolvedIcon fontSize="large" />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Resolution Rate"
            value={
              stats.totalFeedbacks > 0
                ? `${Math.round((stats.resolved / stats.totalFeedbacks) * 100)}%`
                : '0%'
            }
            icon={<CheckCircle fontSize="large" />}
            color="info.main"
          />
        </Grid>
      </Grid>

      {/* Quick Actions and Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<PeopleIcon />}
                onClick={() => navigate('/admin/users')}
                sx={{ justifyContent: 'flex-start', py: 1.5 }}
              >
                User Management
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<FeedbackIcon />}
                onClick={() => navigate('/admin/feedbacks')}
                sx={{ justifyContent: 'flex-start', py: 1.5 }}
              >
                View All Feedbacks
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<UploadIcon />}
                onClick={() => navigate('/admin/materials/upload')}
                sx={{ justifyContent: 'flex-start', py: 1.5 }}
              >
                Upload Material
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<SearchIcon />}
                onClick={() => navigate('/admin/search')}
                sx={{ justifyContent: 'flex-start', py: 1.5 }}
              >
                Search Materials
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Recent Activity
              </Typography>
              <Button size="small" onClick={() => navigate('/admin/feedbacks')}>
                View All
              </Button>
            </Box>
            {recentFeedbacks.length === 0 ? (
              <EmptyState
                title="No recent activity"
                description="There are no feedbacks in the system yet."
              />
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {recentFeedbacks.map((feedback) => (
                  <Box
                    key={feedback._id}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'grey.50', borderColor: 'primary.main' },
                    }}
                    onClick={() => navigate('/admin/feedbacks')}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" noWrap>
                          {feedback.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          From: {feedback.student?.name || 'Unknown'} • {feedback.category}
                        </Typography>
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                          bgcolor: feedback.status === 'resolved' ? 'success.100' : 'warning.100',
                          color: feedback.status === 'resolved' ? 'success.dark' : 'warning.dark',
                          textTransform: 'capitalize',
                        }}
                      >
                        {feedback.status}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// Fix missing import
const CheckCircle = ResolvedIcon;

export default AdminDashboard;
