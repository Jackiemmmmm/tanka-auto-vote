import React from 'react';
// import styles from './styles.css';

const Loading = ({ error = false, errorCallBack }) => (
  <div>
    {error
      ? (
        <a onClick={errorCallBack}>
          {error}
        </a>
      )
      : 'Loading...'}
  </div>
);

export default Loading;
