
// import 'core-js/fn/set';
// import 'core-js/fn/map';
// import 'core-js/fn/object/assign';
// import 'core-js/fn/object/keys';
// import 'core-js/fn/object/values';
// import 'core-js/fn/promise';
// import 'babel-polyfill';
import ReactDOM from 'react-dom';
import React from 'react';
import App from './app';

const isIE = !!window.ActiveXObject || 'ActiveXObject' in window;

ReactDOM.render(
  (
    isIE
      ? (
        <div className="ie-must-die">
          <div className="ie-container">
            <h3>
              BTCC
            </h3>
            <p>
              您当前使用的是IE浏览器，暂不能正常浏览和使用BTCC
              <br />
              建议更换以下浏览器后继续使用BTCC
            </p>
            <div className="link-browser">
              <a href="http://rj.baidu.com/soft/detail/14744.html" rel="noopener noreferrer" target="_blank">
                <br />
                谷歌浏览器
              </a>
              <a href="http://rj.baidu.com/soft/detail/11843.html" className="link-last-item" rel="noopener noreferrer" target="_blank">
                <br />
                火狐浏览器
              </a>
            </div>
          </div>
        </div>
      )
      : <App />
  ),
  document.getElementById('app'),
);
