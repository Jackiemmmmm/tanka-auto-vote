import React, { PureComponent, Fragment } from 'react';
import { Col, Input } from 'antd';

export default class CacheAccount extends PureComponent {
  render() {
    const { formSubmit } = this.props;
    return (
      <Fragment>
        <Col span={24}>
          <h5>缓存账号</h5>
        </Col>
        <form onSubmit={formSubmit}>
          <Col span={6}>
            <Input name="token" placeholder="账号token" />
          </Col>
          <Col span={6}>
            <Input name="remark" placeholder="备注" />
          </Col>
          <Col span={6}>
            <button className="ant-btn ant-btn-primary" type="submit">保存</button>
          </Col>
        </form>
      </Fragment>
    );
  }
}
