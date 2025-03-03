import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

const PostForm = () => {
  const { addPost } = useAppContext();
  const [postData, setText] = useState({
    text: '',
    name: ''
  });

  const { text, name } = postData;

  return (
    <div className="post-form">
      <form
        className="form my-1"
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
          placeholder="What are some things you are thankful for today?"
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
        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

export default PostForm;
