import React, { Fragment, useEffect, useRef, useCallback } from 'react';
import Spinner from '../layout/Spinner';
import PostItem from './PostItem';
import PostForm from './PostForm';
import { useAppContext } from '../../context/AppContext';
import useAdminAuth from '../../hooks/useAdminAuth';

const Wall = () => {
  const { getPosts, loadMorePosts, wall: { posts, loading, hasMore } } = useAppContext();
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAdminAuth();
  const observer = useRef();
  
  // Initial load of posts
  useEffect(() => {
    getPosts();
    // eslint-disable-next-line
  }, []);
  
  // Setup the intersection observer for infinite scrolling
  const lastPostElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMorePosts();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMorePosts]);
  
  // Render posts
  const renderPosts = () => {
    return posts.map((post, index) => {
      if (posts.length === index + 1) {
        return (
          <div ref={lastPostElementRef} key={post.id}>
            <PostItem post={post} />
          </div>
        );
      } else {
        return <PostItem key={post.id} post={post} />;
      }
    });
  };
  
  // Show loading spinner while auth is being checked
  if (authLoading) {
    return <Spinner />;
  }
  
  return (
    <Fragment>
      <h1 className="large text-primary">Posts</h1>
      <p className="lead">
        <i className="fas fa-hand-peace"></i> Welcome{isAuthenticated ? ', Admin!' : '!'}
      </p>
      <PostForm />
      <div className="posts">
        {renderPosts()}
      </div>
      {loading && (
        <div className="post-loading">
          <Spinner />
        </div>
      )}
      {!hasMore && posts.length > 0 && (
        <p className="text-center my-1">No more posts to load</p>
      )}
    </Fragment>
  );
};

export default Wall;
