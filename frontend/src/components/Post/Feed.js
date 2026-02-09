import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import API from '../../utils/api';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import { Container, Typography, CircularProgress, Box } from '@mui/material';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchPosts();
    }
  }, [user, navigate]);

  const fetchPosts = async () => {
    try {
      const res = await API.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Social Feed
      </Typography>
      
      <CreatePost onPostCreated={fetchPosts} />
      
      {posts.length === 0 ? (
        <Typography variant="body1" align="center" color="text.secondary">
          No posts yet. Be the first to post!
        </Typography>
      ) : (
        posts.map(post => (
          <PostCard
            key={post._id}
            post={post}
            onUpdate={handlePostUpdate}
          />
        ))
      )}
    </Container>
  );
};

export default Feed;