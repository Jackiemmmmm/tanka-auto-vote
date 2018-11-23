import React from 'react';
// import styles from './styles.css';

const Loading = ({ error = false, errorCallBack }) => (
  error
    ? (
      <div>
        <a onClick={errorCallBack}>
          {error}
        </a>
      </div>
    )
    : '初始化...'
);

export default Loading;
