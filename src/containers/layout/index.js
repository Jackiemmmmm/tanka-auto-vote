import React, { PureComponent } from 'react';
import getIPs from 'utils/webrtc';

export default class Layout extends PureComponent {
  state = {
    show: false,
    apiFinish: false,
  }

  componentDidMount() {
    getIPs(this.checkIp.bind(this));
  }

  checkIp(ip) {
    let show = false;
    switch (ip) {
      case '192.168.42.143':
      case '192.168.42.241':
        show = true;
        break;
      default:
        break;
    }
    this.setState({ show, apiFinish: true });
  }

  render() {
    const { apiFinish, show } = this.state;
    const { children } = this.props;
    if (!apiFinish) {
      return (
        <div>验证权限...</div>
      );
    }
    return show
      ? (<div style={{ width: '100%', height: '100%' }}>{children}</div>)
      : (<div>暂无权限</div>);
  }
}
