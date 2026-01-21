/**
 * Admin Feedbacks Page
 * View and manage all feedbacks (same as teacher but with admin context)
 */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Tabs,
  Tab,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Reply as ReplyIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { PageHeader, LoadingSpinner, EmptyState, FeedbackCard } from '../../components';
import { feedbackService } from '../../services';

const AdminFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  
  // Response dialog state
  const [responseDialog, setResponseDialog] = useState({
    open: false,
    feedbackId: null,
    feedbackTitle: '',
    response: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    try {
      const data = await feedbackService.getAllFeedbacks();
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

  const handleOpenResponseDialog = (feedback) => {
    setResponseDialog({
      open: true,
      feedbackId: feedback._id,
      feedbackTitle: feedback.title,
      response: '',
    });
  };

  const handleCloseResponseDialog = () => {
    setResponseDialog({
      open: false,
      feedbackId: null,
      feedbackTitle: '',
      response: '',
    });
  };

  const handleSubmitResponse = async () => {
    if (!responseDialog.response.trim()) {
      toast.error('Please enter a response');
      return;
    }

    setIsSubmitting(true);
    try {
      await feedbackService.respondToFeedback(
        responseDialog.feedbackId,
        responseDialog.response
      );
      toast.success('Response submitted successfully');
      handleCloseResponseDialog();
      fetchFeedbacks();
    } catch (error) {
      toast.error('Failed to submit response');
      console.error('Error submitting response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading feedbacks..." />;
  }

  return (
    <Box>
      <PageHeader
        title="All Feedbacks"
        subtitle="View and manage all student feedbacks"
        breadcrumbs={[
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Feedbacks' },
        ]}
        actions={
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchFeedbacks}
          >
            Refresh
          </Button>
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
          title={`No ${activeTab === 'all' ? '' : activeTab} feedbacks`}
          description="No feedbacks found in this category."
        />
      ) : (
        <Box>
          {filteredFeedbacks.map((feedback) => (
            <FeedbackCard
              key={feedback._id}
              feedback={feedback}
              showStudent={true}
              expanded={expandedId === feedback._id}
              onToggleExpand={() => handleToggleExpand(feedback._id)}
              actions={
                feedback.status === 'pending' && (
                  <Button
                    variant="contained"
                    startIcon={<ReplyIcon />}
                    onClick={() => handleOpenResponseDialog(feedback)}
                  >
                    Respond
                  </Button>
                )
              }
            />
          ))}
        </Box>
      )}

      {/* Response Dialog */}
      <Dialog
        open={responseDialog.open}
        onClose={handleCloseResponseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Respond to Feedback
          <Box component="span" sx={{ display: 'block', fontSize: '0.9rem', color: 'text.secondary' }}>
            {responseDialog.feedbackTitle}
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={4}
            label="Your Response"
            value={responseDialog.response}
            onChange={(e) =>
              setResponseDialog((prev) => ({ ...prev, response: e.target.value }))
            }
            placeholder="Enter your response to the student's feedback..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseResponseDialog} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitResponse}
            disabled={isSubmitting || !responseDialog.response.trim()}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Response'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminFeedbacks;
