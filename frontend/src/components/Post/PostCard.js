import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../utils/api';
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  TextField,
  Button,
  Box,
  Collapse
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Send
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

const PostCard = ({ post, onUpdate }) => {
  const { user } = useContext(AuthContext);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);

  const isLiked = user && post.likes.includes(user.id);

  const handleLike = async () => {
    try {
      const res = await API.put(`/posts/${post._id}/like`);
      onUpdate(res.data);
    } catch (err) {
      console.error('Failed to like post');
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    
    setLoading(true);
    try {
      const res = await API.post(`/posts/${post._id}/comment`, {
        text: commentText
      });
      setCommentText('');
      onUpdate(res.data);
    } catch (err) {
      console.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {post.username[0].toUpperCase()}
          </Avatar>
        }
        title={post.username}
        subheader={formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
      />
      
      {post.text && (
        <CardContent>
          <Typography variant="body1">{post.text}</Typography>
        </CardContent>
      )}
      
      {post.image && (
        <CardMedia
          component="img"
          image={`https://social-post-app-slvz.onrender.com${post.image}`}
          alt="Post image"
          sx={{ maxHeight: 500, objectFit: 'contain' }}
        />
      )}
      
      <CardActions disableSpacing>
        <IconButton onClick={handleLike} disabled={!user}>
          {isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
        <Typography variant="body2">{post.likes.length}</Typography>
        
        <IconButton onClick={() => setShowComments(!showComments)} sx={{ ml: 2 }}>
          <ChatBubbleOutline />
        </IconButton>
        <Typography variant="body2">{post.comments.length}</Typography>
      </CardActions>
      
      <Collapse in={showComments} timeout="auto" unmountOnExit>
        <CardContent>
          {user && (
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleComment}
                disabled={loading || !commentText.trim()}
                startIcon={<Send />}
              >
                Post
              </Button>
            </Box>
          )}
          
          {post.comments.map((comment, index) => (
            <Box key={index} sx={{ mb: 2, pl: 2, borderLeft: '2px solid #e0e0e0' }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {comment.username}
              </Typography>
              <Typography variant="body2">{comment.text}</Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default PostCard;