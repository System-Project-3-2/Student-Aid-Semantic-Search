/**
 * Teacher Dashboard
 * Overview of teacher's activities and statistics
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Typography, Button, Paper } from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Feedback as FeedbackIcon,
  CheckCircle as ResolvedIcon,
  HourglassEmpty as PendingIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { PageHeader, StatCard, LoadingSpinner, EmptyState } from '../../components';
import { useAuth } from '../../hooks';
import { feedbackService } from '../../services';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalFeedbacks: 0,
    pending: 0,
    resolved: 0,
  });
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const feedbacks = await feedbackService.getAllFeedbacks();
      
      const pending = feedbacks.filter((f) => f.status === 'pending').length;
      const resolved = feedbacks.filter((f) => f.status === 'resolved').length;
      
      setStats({
        totalFeedbacks: feedbacks.length,
        pending,
        resolved,
      });
      
      // Get recent pending feedbacks
      setRecentFeedbacks(
        feedbacks.filter((f) => f.status === 'pending').slice(0, 5)
      );
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
        subtitle="Manage materials and student feedbacks"
        actions={
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={() => navigate('/teacher/materials/upload')}
          >
            Upload Material
          </Button>
        }
      />

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Feedbacks"
            value={stats.totalFeedbacks}
            icon={<FeedbackIcon fontSize="large" />}
            color="primary.main"
            onClick={() => navigate('/teacher/feedbacks')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<PendingIcon fontSize="large" />}
            color="warning.main"
            subtitle="Awaiting response"
            onClick={() => navigate('/teacher/feedbacks')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Resolved"
            value={stats.resolved}
            icon={<ResolvedIcon fontSize="large" />}
            color="success.main"
          />
        </Grid>
      </Grid>

      {/* Quick Actions and Recent Feedbacks */}
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
                startIcon={<UploadIcon />}
                onClick={() => navigate('/teacher/materials/upload')}
                sx={{ justifyContent: 'flex-start', py: 1.5 }}
              >
                Upload Material
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<FeedbackIcon />}
                onClick={() => navigate('/teacher/feedbacks')}
                sx={{ justifyContent: 'flex-start', py: 1.5 }}
              >
                View All Feedbacks
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<SearchIcon />}
                onClick={() => navigate('/teacher/search')}
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
                Pending Feedbacks
              </Typography>
              <Button size="small" onClick={() => navigate('/teacher/feedbacks')}>
                View All
              </Button>
            </Box>
            {recentFeedbacks.length === 0 ? (
              <EmptyState
                title="No pending feedbacks"
                description="All student feedbacks have been addressed. Great job!"
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
                    onClick={() => navigate('/teacher/feedbacks')}
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
                          bgcolor: 'warning.100',
                          color: 'warning.dark',
                        }}
                      >
                        Pending
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

export default TeacherDashboard;
