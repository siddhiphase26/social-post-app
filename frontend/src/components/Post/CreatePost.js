import React, { useState } from 'react';
import API from '../../utils/api';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  IconButton
} from '@mui/material';
import { PhotoCamera, Send } from '@mui/icons-material';

const CreatePost = ({ onPostCreated }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text && !image) {
      alert('Please add text or image');
      return;
    }

    setLoading(true);
    
    const formData = new FormData();
    if (text) formData.append('text', text);
    if (image) formData.append('image', image);

    try {
      await API.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Reset form
      setText('');
      setImage(null);
      setImagePreview(null);
      
      // Refresh posts
      onPostCreated();
    } catch (err) {
      alert('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create Post
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        {imagePreview && (
          <Box sx={{ mb: 2 }}>
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }}
            />
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label htmlFor="image-upload">
            <input
              accept="image/*"
              id="image-upload"
              type="file"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <IconButton color="primary" component="span">
              <PhotoCamera />
            </IconButton>
          </label>
          
          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            startIcon={<Send />}
          >
            {loading ? 'Posting...' : 'Post'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CreatePost;