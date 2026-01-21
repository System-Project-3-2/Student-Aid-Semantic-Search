/**
 * My Feedbacks Page
 * View all submitted feedbacks and their status
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { PageHeader, LoadingSpinner, EmptyState, FeedbackCard } from '../../components';
import { feedbackService } from '../../services';

const MyFeedbacks = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    try {
      const data = await feedbackService.getMyFeedbacks();
      setFeedbacks(data);
    } catch (error) {
      toast.error('Failed to load feedbacks');
      console.error('Error fetching feedbacks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    if (activeTab === 'all') return true;
    return feedback.status === activeTab;
  });

  const pendingCount = feedbacks.filter((f) => f.status === 'pending').length;
  const resolvedCount = feedbacks.filter((f) => f.status === 'resolved').length;

  const handleToggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading feedbacks..." />;
  }

  return (
    <Box>
      <PageHeader
        title="My Feedbacks"
        subtitle="Track your submitted feedbacks and their responses"
        breadcrumbs={[
          { label: 'Dashboard', path: '/student/dashboard' },
          { label: 'My Feedbacks' },
        ]}
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchFeedbacks}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/student/feedback/new')}
            >
              New Feedback
            </Button>
          </Box>
        }
      />

      {/* Tabs for filtering */}
      <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={(e, value) => setActiveTab(value)}
          aria-label="feedback status tabs"
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                All
                <Chip label={feedbacks.length} size="small" />
              </Box>
            }
            value="all"
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Pending
                <Chip label={pendingCount} size="small" color="warning" />
              </Box>
            }
            value="pending"
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Resolved
                <Chip label={resolvedCount} size="small" color="success" />
              </Box>
            }
            value="resolved"
          />
        </Tabs>
      </Box>

      {/* Feedback List */}
      {filteredFeedbacks.length === 0 ? (
        <EmptyState
          title={
            activeTab === 'all'
              ? 'No feedbacks yet'
              : `No ${activeTab} feedbacks`
          }
          description={
            activeTab === 'all'
              ? "You haven't submitted any feedback yet. Click the button below to submit your first feedback."
              : `You don't have any ${activeTab} feedbacks at the moment.`
          }
          actionLabel={activeTab === 'all' ? 'Submit Feedback' : null}
          onAction={activeTab === 'all' ? () => navigate('/student/feedback/new') : null}
        />
      ) : (
        <Box>
          {filteredFeedbacks.map((feedback) => (
            <FeedbackCard
              key={feedback._id}
              feedback={feedback}
              expanded={expandedId === feedback._id}
              onToggleExpand={() => handleToggleExpand(feedback._id)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default MyFeedbacks;
