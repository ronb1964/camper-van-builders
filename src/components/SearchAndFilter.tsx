import React, { useState } from 'react';
import { 
  TextField, 
  InputAdornment, 
  Slider, 
  FormControlLabel, 
  Checkbox, 
  Chip, 
  Button,
  Drawer,
  IconButton,
  Typography,
  Box,
  Rating
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import StarBorderIcon from '@mui/icons-material/StarBorder';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  priceRange: [number, number];
  onPriceChange: (value: [number, number]) => void;
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
  selectedAmenities: string[];
  onAmenityToggle: (amenity: string) => void;
  minRating: number;
  onRatingChange: (value: number) => void;
  allVanTypes: string[];
  allAmenities: string[];
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  priceRange,
  onPriceChange,
  selectedTypes,
  onTypeToggle,
  selectedAmenities,
  onAmenityToggle,
  minRating,
  onRatingChange,
  allVanTypes,
  allAmenities
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilterDrawer = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name, city, or description..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={toggleFilterDrawer}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Filters
        </Button>
      </Box>

      <Drawer
        anchor="right"
        open={isFilterOpen}
        onClose={toggleFilterDrawer}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={toggleFilterDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>Price Range</Typography>
            <Slider
              value={priceRange}
              onChange={(_, newValue) => onPriceChange(newValue as [number, number])}
              valueLabelDisplay="auto"
              min={0}
              max={200000}
              step={5000}
              valueLabelFormat={(value) => `$${value.toLocaleString()}`}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">${priceRange[0].toLocaleString()}</Typography>
              <Typography variant="body2">${priceRange[1].toLocaleString()}</Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>Minimum Rating</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating
                value={minRating}
                onChange={(_event: React.SyntheticEvent<Element, Event>, newValue: number | null) => onRatingChange(newValue || 0)}
                precision={0.5}
                emptyIcon={<StarBorderIcon fontSize="inherit" />}
              />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {minRating > 0 ? `${minRating}+` : 'Any'}
              </Typography>
            </Box>
          </Box>


          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>Van Types</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {allVanTypes.map((type) => (
                <Chip
                  key={type}
                  label={type}
                  onClick={() => onTypeToggle(type)}
                  color={selectedTypes.includes(type) ? 'primary' : 'default'}
                  variant={selectedTypes.includes(type) ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Box>


          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>Amenities</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {allAmenities.map((amenity) => (
                <Chip
                  key={amenity}
                  label={amenity}
                  onClick={() => onAmenityToggle(amenity)}
                  color={selectedAmenities.includes(amenity) ? 'primary' : 'default'}
                  variant={selectedAmenities.includes(amenity) ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={toggleFilterDrawer}
            sx={{ mt: 2 }}
          >
            Apply Filters
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default SearchAndFilter;
