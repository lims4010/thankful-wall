import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addPost } from '../../actions/post';

const PostForm = ({ addPost }) => {
  const [postData, setText] = useState({
    text: '',
    name: ''
  });

  const { text, name } = postData;

  return (
    <div class="post-form">
      <div class="bg-primary p">
        <h3>Say Something...</h3>
      </div>
      <form
        class="form my-1"
        onSubmit={e => {
          e.preventDefault();
          addPost(text, name);
          setText({ text: '', name: '' });
        }}
      >
        <textarea
          name="text"
          cols="30"
          rows="5"
          placeholder="Write a post here..."
          value={text}
          onChange={e =>
            setText({ ...postData, [e.target.name]: e.target.value })
          }
          required
        ></textarea>
        <textarea
          name="name"
          cols="30"
          rows="1"
          placeholder="Optional Name"
          value={name}
          onChange={e =>
            setText({ ...postData, [e.target.name]: e.target.value })
          }
        ></textarea>
        <input type="submit" class="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired
};

export default connect(null, { addPost })(PostForm);
