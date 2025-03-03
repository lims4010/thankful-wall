import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { useAppContext } from '../../context/AppContext';
import useAdminAuth from '../../hooks/useAdminAuth';

const PostItem = ({
  post: { id, text, name, likes, created_date },
  showActions
}) => {
  const { addLike, deletePost } = useAppContext();
  const { isAdmin, isLoading } = useAdminAuth();

  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <p>{text}</p>
        <p className="my-1 post-date">
          {name}
          {' | '}
          Posted on <Moment format="YYYY/MM/DD">{created_date}</Moment>
        </p>

        {showActions && (
          <Fragment>
            <button
              onClick={e => addLike(id)}
              type="button"
              className="btn btn-light"
            >
              <i className="fas fa-thumbs-up"></i>{' '}
              {likes.length > 0 && <span>{likes.length}</span>}
            </button>
            {!isLoading && isAdmin && (
              <button
                onClick={e => deletePost(id)}
                type="button"
                className="btn btn-danger"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
};

PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired
};

export default PostItem;
