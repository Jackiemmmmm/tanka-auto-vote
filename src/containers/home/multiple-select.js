import React, { PureComponent } from 'react';
import { Select } from 'antd';

const { Option } = Select;

export default class MultipleSelect extends PureComponent {
  handleChange = (value) => {
    const { cacheList, selectCallback } = this.props;
    const data = cacheList.filter(item => value.indexOf(item.remark) > -1);
    selectCallback(data);
  }

  render() {
    const { cacheList } = this.props;
    return (
      <Select
        style={{ width: '50%' }}
        placeholder="请选择"
        mode="multiple"
        defaultValue={cacheList.map(item => item.remark)}
        onChange={this.handleChange}
      >
        {
          cacheList.length !== 0
          && cacheList.map((item, idx) => (
            <Option key={`${item.token} ${idx}`} value={item.remark}>{item.remark}</Option>
          ))
        }
      </Select>
    );
  }
}
