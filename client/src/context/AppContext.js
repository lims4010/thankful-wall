import React, { createContext, useReducer, useContext, useRef } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Initial state
const initialState = {
  alerts: [],
  wall: {
    posts: [],
    loading: true,
    error: {},
    hasMore: true,
    lastEvaluatedKey: null,
    limit: 10
  }
};

// Create context
const AppContext = createContext(initialState);

// Action types
const SET_ALERT = 'SET_ALERT';
const REMOVE_ALERT = 'REMOVE_ALERT';
const GET_POSTS = 'GET_POSTS';
const APPEND_POSTS = 'APPEND_POSTS';
const POST_ERROR = 'POST_ERROR';
const UPDATE_LIKES = 'UPDATE_LIKES';
const DELETE_POST = 'DELETE_POST';
const ADD_POST = 'ADD_POST';
const SET_LOADING = 'SET_LOADING';

// Reducer function
const appReducer = (state, action) => {
  const { type, payload } = action;
  
  switch (type) {
    case SET_ALERT:
      return {
        ...state,
        alerts: [...state.alerts, payload]
      };
    case REMOVE_ALERT:
      return {
        ...state,
        alerts: state.alerts.filter(alert => alert.id !== payload)
      };
    case GET_POSTS:
      return {
        ...state,
        wall: {
          ...state.wall,
          posts: payload.posts,
          hasMore: !!payload.lastEvaluatedKey,
          lastEvaluatedKey: payload.lastEvaluatedKey || null,
          loading: false
        }
      };
    case APPEND_POSTS:
      return {
        ...state,
        wall: {
          ...state.wall,
          posts: [...state.wall.posts, ...payload.posts],
          hasMore: !!payload.lastEvaluatedKey,
          lastEvaluatedKey: payload.lastEvaluatedKey || null,
          loading: false
        }
      };
    case SET_LOADING:
      return {
        ...state,
        wall: {
          ...state.wall,
          loading: true
        }
      };
    case ADD_POST:
      return {
        ...state,
        wall: {
          ...state.wall,
          posts: [payload, ...state.wall.posts],
          loading: false
        }
      };
    case DELETE_POST:
      return {
        ...state,
        wall: {
          ...state.wall,
          posts: state.wall.posts.filter(post => post.id !== payload),
          loading: false
        }
      };
    case POST_ERROR:
      return {
        ...state,
        wall: {
          ...state.wall,
          error: payload,
          loading: false
        }
      };
    case UPDATE_LIKES:
      return {
        ...state,
        wall: {
          ...state.wall,
          posts: state.wall.posts.map(post => 
            post.id === payload.postId
              ? { ...post, likes: payload.likes }
              : post
          ),
          loading: false
        }
      };
    default:
      return state;
  }
};

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Track recent alerts to prevent duplicates
  const recentAlerts = useRef({});

  // Actions
  const setAlert = (msg, alertType, timeout = 5000) => {
    // Create a unique key for this alert message and type
    const alertKey = `${msg}-${alertType}`;
    
    // Check if this exact alert was recently shown
    if (recentAlerts.current[alertKey]) {
      return; // Skip duplicate alert
    }
    
    // Mark this alert as recently shown
    recentAlerts.current[alertKey] = true;
    
    // Create a unique ID for this alert instance
    const id = uuidv4();
    
    // Dispatch the alert
    dispatch({
      type: SET_ALERT,
      payload: { msg, alertType, id }
    });

    // Set up removal of the alert
    setTimeout(() => {
      dispatch({ type: REMOVE_ALERT, payload: id });
      
      // After the alert is removed and some additional time has passed,
      // allow this alert to be shown again
      setTimeout(() => {
        delete recentAlerts.current[alertKey];
      }, 1000); // Wait 1 second after alert is removed before allowing it again
    }, timeout);
  };

  const getPosts = async (resetPage = true) => {
    try {
      if (resetPage) {
        dispatch({ type: SET_LOADING });
        const res = await axios.get(`/api/posts?limit=${state.wall.limit}&partitionKey=PUBLIC`);
        
        dispatch({
          type: GET_POSTS,
          payload: {
            posts: res.data.posts,
            lastEvaluatedKey: res.data.lastEvaluatedKey
          }
        });
      } else if (state.wall.hasMore && !state.wall.loading) {
        dispatch({ type: SET_LOADING });
        const lastKeyParam = state.wall.lastEvaluatedKey ? 
          `&lastKey=${encodeURIComponent(JSON.stringify(state.wall.lastEvaluatedKey))}` : '';
        const res = await axios.get(`/api/posts?limit=${state.wall.limit}${lastKeyParam}&partitionKey=PUBLIC`);
        
        dispatch({
          type: APPEND_POSTS,
          payload: {
            posts: res.data.posts,
            lastEvaluatedKey: res.data.lastEvaluatedKey
          }
        });
      }
    } catch (error) {
      dispatch({
        type: POST_ERROR,
        payload: { 
          msg: error.response?.data?.msg || 'Server Error', 
          status: error.response?.status || 500
        }
      });
    }
  };

  const loadMorePosts = async () => {
    await getPosts(false);
  };

  const addLike = async (postId) => {
    try {
      const res = await axios.put(`/api/posts/like/${postId}?post_type=PUBLIC`);

      dispatch({
        type: UPDATE_LIKES,
        payload: { postId, likes: res.data }
      });
    } catch (error) {
      dispatch({
        type: POST_ERROR,
        payload: { 
          msg: error.response?.data?.msg || 'Server Error', 
          status: error.response?.status || 500
        }
      });
    }
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(`/api/posts/${postId}?post_type=PUBLIC`);

      dispatch({
        type: DELETE_POST,
        payload: postId
      });

      setAlert('Post Removed', 'success');
    } catch (error) {
      dispatch({
        type: POST_ERROR,
        payload: { 
          msg: error.response?.data?.msg || 'Server Error', 
          status: error.response?.status || 500
        }
      });
    }
  };

  const addPost = async (text, name) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const body = JSON.stringify({ text, name, partitionKey: 'PUBLIC' });

    try {
      const res = await axios.post('/api/posts/', body, config);

      dispatch({
        type: ADD_POST,
        payload: res.data
      });

      setAlert('Post Created', 'success');
    } catch (error) {
      dispatch({
        type: POST_ERROR,
        payload: { 
          msg: error.response?.data?.msg || 'Server Error', 
          status: error.response?.status || 500
        }
      });
      
      if (error.response?.status === 401) {
        setAlert('Max posts reached. Please try again later.', 'danger');
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        alerts: state.alerts,
        wall: state.wall,
        setAlert,
        getPosts,
        loadMorePosts,
        addLike,
        deletePost,
        addPost
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Use context hook
export const useAppContext = () => useContext(AppContext); 