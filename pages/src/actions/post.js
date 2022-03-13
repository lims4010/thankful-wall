import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST
} from './types';

// Get posts
export const getPosts = () => async dispatch => {
  try {
    const res = await axios.get('/api/posts');

    dispatch({
      type: GET_POSTS,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.data.msg, status: error.response.status }
    });
  }
};

// Add like
export const addLike = postId => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/like/${postId}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { postId, likes: res.data }
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.data.msg,
        status: error.response.status
      }
    });
  }
};

// 3/13/22 - Removed feature. Include in Like logic.
// remove like
// export const removeLike = postId => async dispatch => {
//   try {
//     const res = await axios.put(`/api/posts/unlike/${postId}`);

//     dispatch({
//       type: UPDATE_LIKES,
//       payload: { postId, likes: res.data }
//     });
//   } catch (error) {
//     dispatch({
//       type: POST_ERROR,
//       payload: { msg: error.response.data.msg, status: error.response.status }
//     });
//   }
// };

// add post
export const addPost = (text, name) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ text, name });

  try {
    const res = await axios.post('/api/posts/', body, config);

    dispatch({
      type: ADD_POST,
      payload: res.data
    });

    dispatch(setAlert('Post Created', 'success'));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.data.errors,
        status: error.response.status
      }
    });
    if (error.response.status === 401) {
      dispatch(
        setAlert('Max posts reached. Please try again later.', 'danger')
      );
    }
  }
};

// delete post
export const deletePost = postId => async dispatch => {
  try {
    await axios.delete(`/api/posts/${postId}`);

    dispatch({
      type: DELETE_POST,
      payload: postId
    });

    dispatch(setAlert('Post Removed', 'success'));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.data.msg, status: error.response.status }
    });
  }
};
