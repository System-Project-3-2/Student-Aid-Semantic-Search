/**
 * Student Dashboard
 * Overview of student's activities and quick actions
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Typography, Button, Paper } from '@mui/material';
import {
  Feedback as FeedbackIcon,
  Search as SearchIcon,
  CheckCircle as ResolvedIcon,
  HourglassEmpty as PendingIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { PageHeader, StatCard, LoadingSpinner, EmptyState } from '../../components';
import { useAuth } from '../../hooks';
import { feedbackService } from '../../services';

const StudentDashboard = () => {
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
      const feedbacks = await feedbackService.getMyFeedbacks();
      
      const pending = feedbacks.filter((f) => f.status === 'pending').length;
      const resolved = feedbacks.filter((f) => f.status === 'resolved').length;
      
      setStats({
        totalFeedbacks: feedbacks.length,
        pending,
        resolved,
      });
      
      setRecentFeedbacks(feedbacks.slice(0, 3));
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
        subtitle="Here's an overview of your academic activities"
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/student/feedback/new')}
          >
            Submit Feedback
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
            onClick={() => navigate('/student/feedbacks')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<PendingIcon fontSize="large" />}
            color="warning.main"
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

      {/* Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
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
                startIcon={<SearchIcon />}
                onClick={() => navigate('/student/search')}
                sx={{ justifyContent: 'flex-start', py: 1.5 }}
              >
                Search Materials
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<AddIcon />}
                onClick={() => navigate('/student/feedback/new')}
                sx={{ justifyContent: 'flex-start', py: 1.5 }}
              >
                Submit New Feedback
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<FeedbackIcon />}
                onClick={() => navigate('/student/feedbacks')}
                sx={{ justifyContent: 'flex-start', py: 1.5 }}
              >
                View My Feedbacks
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
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
                Recent Feedbacks
              </Typography>
              <Button size="small" onClick={() => navigate('/student/feedbacks')}>
                View All
              </Button>
            </Box>
            {recentFeedbacks.length === 0 ? (
              <EmptyState
                title="No feedbacks yet"
                description="You haven't submitted any feedback yet."
                actionLabel="Submit Feedback"
                onAction={() => navigate('/student/feedback/new')}
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
                      '&:hover': { bgcolor: 'grey.50' },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" noWrap sx={{ maxWidth: '70%' }}>
                        {feedback.title}
                      </Typography>
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
                    <Typography variant="caption" color="text.secondary">
                      {feedback.category}
                    </Typography>
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

export default StudentDashboard;
