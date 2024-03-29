import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { addLike, deletePost } from '../../actions/post';

const PostItem = ({
  addLike,
  deletePost,
  auth,
  post: { _id, text, name, likes, date },
  showActions
}) => {
  return (
    <div class="post bg-white p-1 my-1">
      <div>
        <p>{text}</p>
        <p class="my-1 post-date">
          {name}
          {' | '}
          Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
        </p>

        {showActions && (
          <Fragment>
            <button
              onClick={e => addLike(_id)}
              type="button"
              class="btn btn-light"
            >
              <i class="fas fa-thumbs-up"></i>{' '}
              {likes > 0 && <span>{likes}</span>}
            </button>
            {!auth.loading && auth.isAuthenticated && (
              <button
                onClick={e => deletePost(_id)}
                type="button"
                class="btn btn-danger"
              >
                <i class="fas fa-times"></i>
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
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { addLike, deletePost })(
  PostItem
);
