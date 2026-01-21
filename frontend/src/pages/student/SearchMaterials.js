/**
 * Search Materials Page
 * Semantic search for educational materials
 */
import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { PageHeader, LoadingSpinner, EmptyState, MaterialCard } from '../../components';
import { materialService } from '../../services';

// Course options - can be fetched from API in production
const COURSES = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
];

// Material types
const MATERIAL_TYPES = ['Lecture Notes', 'Assignment', 'Lab Report', 'Book', 'Slides', 'Other'];

const SearchMaterials = () => {
  const [query, setQuery] = useState('');
  const [course, setCourse] = useState('');
  const [type, setType] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedMaterial, setExpandedMaterial] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const searchParams = { query };
      if (course) searchParams.course = course;
      if (type) searchParams.type = type;

      const data = await materialService.searchMaterials(searchParams);
      setResults(data);
      
      if (data.length === 0) {
        toast.info('No materials found matching your query');
      } else {
        toast.success(`Found ${data.length} material(s)`);
      }
    } catch (error) {
      toast.error('Search failed. Please try again.');
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setCourse('');
    setType('');
    setResults([]);
    setHasSearched(false);
  };

  const toggleExpand = (materialTitle) => {
    setExpandedMaterial(expandedMaterial === materialTitle ? null : materialTitle);
  };

  return (
    <Box>
      <PageHeader
        title="Search Materials"
        subtitle="Find educational materials using semantic search"
      />

      {/* Search Form */}
      <Paper
        component="form"
        onSubmit={handleSearch}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <TextField
              fullWidth
              placeholder="Search for materials... (e.g., 'data structures and algorithms')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Course (Optional)</InputLabel>
              <Select
                value={course}
                label="Course (Optional)"
                onChange={(e) => setCourse(e.target.value)}
              >
                <MenuItem value="">All Courses</MenuItem>
                {COURSES.map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Type (Optional)</InputLabel>
              <Select
                value={type}
                label="Type (Optional)"
                onChange={(e) => setType(e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                {MATERIAL_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                startIcon={<SearchIcon />}
                disabled={isLoading}
              >
                Search
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={handleClear}
                startIcon={<ClearIcon />}
              >
                Clear
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Active Filters */}
        {(course || type) && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <FilterIcon fontSize="small" color="action" sx={{ mr: 1 }} />
            {course && (
              <Chip
                label={`Course: ${course}`}
                size="small"
                onDelete={() => setCourse('')}
              />
            )}
            {type && (
              <Chip
                label={`Type: ${type}`}
                size="small"
                onDelete={() => setType('')}
              />
            )}
          </Box>
        )}
      </Paper>

      {/* Results */}
      {isLoading ? (
        <LoadingSpinner message="Searching materials..." />
      ) : hasSearched ? (
        results.length > 0 ? (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Found {results.length} material(s)
            </Typography>
            {results.map((material) => (
              <MaterialCard
                key={material.title}
                material={material}
                expanded={expandedMaterial === material.title}
                onToggleExpand={() => toggleExpand(material.title)}
              />
            ))}
          </Box>
        ) : (
          <EmptyState
            title="No materials found"
            description="Try adjusting your search query or filters to find more results."
            icon={<SearchIcon sx={{ fontSize: 64 }} />}
          />
        )
      ) : (
        <EmptyState
          title="Start Searching"
          description="Enter a search query to find relevant educational materials."
          icon={<SearchIcon sx={{ fontSize: 64 }} />}
        />
      )}
    </Box>
  );
};

export default SearchMaterials;
