import React, { Fragment } from 'react';

const About = props => {
  return (
    <Fragment>
      <h1 className="large text-primary">About</h1>
      <p className="lead">
        The purpose of this wall is to provide a space for an{' '}
        <span className="text-bold">open gratitude journal</span> where people
        are able to read or share about the things in life (big or small) they
        are thankful for. It is a journal that seeks to instill a habit of
        practicing gratitude daily and to encourage others with reflections from
        the everyday lives of people around them.
      </p>
      <p className="lead">
        So feel free to contribute and write a post! There are no strict rules
        or guidelines, only that the content{' '}
        <span className="text-bold">remain appropriate</span> and{' '}
        <span className="text-bold">
          refrain from sharing private information
        </span>
        . To prevent spamming, there is limit of 3 posts per 24 hour period. As
        you are commuting to work or finishing up ping pong practice or
        preparing to go to bed at night, take some time to think...what are some
        things you are thankful for today?
      </p>
      <div className="quote">
        <p>Rejoice always,</p> <p> pray continually,</p>{' '}
        <p> give thanks in all circumstances;</p>
        <p>for this is God’s will for you in Christ Jesus.</p>
        <p> ― 1 Thessalonians 5:16-18</p>
      </div>
      <div className="quote">
        <p>“Yesterday is history,</p>
        <p>tomorrow is a mystery,</p>
        <p>and today is a gift...</p>
        <p>that's why they call it present” </p>
        <p> ― Master Oogway</p>
      </div>

      <p className="my-1">
        For any questions or concerns, please contact lims4011@gmail.com for
        information.
      </p>
    </Fragment>
  );
};

About.propTypes = {};

export default About;
