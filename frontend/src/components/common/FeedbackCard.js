/**
 * FeedbackCard Component
 * Displays a feedback item with status and optional response
 */
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Collapse,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as ResolvedIcon,
  HourglassEmpty as PendingIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const FeedbackCard = ({
  feedback,
  showStudent = false,
  actions = null,
  expanded = false,
  onToggleExpand = null,
}) => {
  const isResolved = feedback.status === 'resolved';

  const getCategoryColor = (category) => {
    const colors = {
      'Missing Material': 'warning',
      'Wrong Content': 'error',
      'Technical Issue': 'info',
      'Other': 'default',
    };
    return colors[category] || 'default';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        mb: 2,
        '&:hover': {
          borderColor: 'primary.main',
        },
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Chip
                size="small"
                icon={isResolved ? <ResolvedIcon /> : <PendingIcon />}
                label={feedback.status}
                color={isResolved ? 'success' : 'warning'}
                sx={{ textTransform: 'capitalize' }}
              />
              <Chip
                size="small"
                label={feedback.category}
                color={getCategoryColor(feedback.category)}
                variant="outlined"
              />
            </Box>
            <Typography variant="h6" gutterBottom>
              {feedback.title}
            </Typography>
            {showStudent && feedback.student && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                <PersonIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {feedback.student.name} ({feedback.student.email})
                </Typography>
              </Box>
            )}
            <Typography variant="body2" color="text.secondary">
              Submitted: {formatDate(feedback.createdAt)}
            </Typography>
          </Box>
          {onToggleExpand && (
            <IconButton
              onClick={onToggleExpand}
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          )}
        </Box>

        {/* Expandable Content */}
        <Collapse in={expanded}>
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Message:
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
              {feedback.message}
            </Typography>

            {/* Response Section */}
            {feedback.response && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: 'success.50',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'success.200',
                }}
              >
                <Typography variant="subtitle2" color="success.dark" gutterBottom>
                  Response:
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {feedback.response}
                </Typography>
                {feedback.respondedBy && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Responded by: {feedback.respondedBy.name} • {formatDate(feedback.resolvedAt)}
                  </Typography>
                )}
              </Box>
            )}

            {/* Actions */}
            {actions && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                {actions}
              </Box>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default FeedbackCard;
