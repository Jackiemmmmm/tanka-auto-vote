import React, { PureComponent } from 'react';
import Axios from 'axios';
import {
  Row, Col, Select, Input, notification,
} from 'antd';
import styles from './styles.css';

const { Option } = Select;

export default class Votes extends PureComponent {
  state = {
    cacheList: [],
    list: [],
    settimeoutMap: {},
  }

  componentWillMount() {
    const data = localStorage.getItem('cache');
    if (data) {
      this.setState({ cacheList: JSON.parse(data) });
    }
  }

  handleChange = (value) => {
    console.log(`selected ${value}`);
  }

  async fakeShareWeixin({ cardid, token, length, name }) {
    try {
      const { data } = await Axios.post(
        'https://api-tanka.tictalk.com/v1/shares/fake_weixin',
        {
          entity_type: 'card',
          entity_id: cardid,
          target_type: 'weixin',
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(data);
      this.voteRequest({ cardid, token, length, name }, true);
    } catch (error) {
      notification.error({
        message: '分享失败',
        description: error.message,
      });
    }
  }

  async voteRequest({ cardid, token, length, name }, bol = false) {
    try {
      const { data } = await Axios.post(
        'https://api-tanka.tictalk.com/vote',
        {
          activity_name: 'fit_star_rank',
          target_id: cardid,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      notification.success({
        message: '投票成功',
        description: `已用${length}个账号为用户${name}投票`,
      });
      const { list, settimeoutMap } = this.state;
      if (!settimeoutMap[cardid]) {
        this.setState(prev => ({
          settimeoutMap: Object.assign({}, prev.settimeoutMap, {
            [cardid]: { cardid, token, length, name },
          }),
        }), () => {
          console.log(settimeoutMap);
        });
      }
      return this.setState({
        list: list.map((item) => {
          if (item.card.card_id === cardid) {
            return Object.assign({}, item, {
              votes: item.votes + data.result.votes,
            });
          }
          return item;
        }),
      }, () => {
        if (!bol) this.voteRequest({ cardid, token, length, name });
      });
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.code === 711) {
        return this.fakeShareWeixin({ cardid, token, length, name });
      }
      return notification.error({
        message: '投票失败',
        description: error.response && error.response.data.message,
      });
    }
  }

  formSubmit(e, bol = false) {
    e.preventDefault();
    if (bol) {
      const { token, remark } = e.target;
      const concatData = [{ token: token.value, remark: remark.value }];
      const getStorage = localStorage.getItem('cache');
      let data = JSON.stringify(concatData);
      if (getStorage) {
        data = JSON.stringify(concatData.concat(JSON.parse(getStorage)));
      }
      localStorage.setItem('cache', data);
      this.setState({ cacheList: JSON.parse(data) });
      return e.target.reset();
    }
    const { cardid, cardname } = e.target;
    const { cacheList } = this.state;
    return cacheList.map(item => this.voteRequest({ cardid: cardid.value, token: item.token, length: cacheList.length, name: cardname.value }));
  }

  async searchSubmit(e) {
    try {
      e.preventDefault();
      const { keyward } = e.target;
      const { data } = await Axios.get(`https://api-tanka.tictalk.com/activity/super_fit_star_2018/search/?keyword=${keyward.value}&page=1&per_page=20`);
      notification.success({
        message: '搜索成功',
        description: `共${data.result.count}条结果`,
      });
      this.setState({ list: data.result.list });
    } catch (error) {
      notification.error({
        message: '搜索失败',
        description: error.message,
      });
    }
  }

  toThousands(n) {
    return (n || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1, ');
  }

  render() {
    const { cacheList, list } = this.state;
    return (
      <div>
        <Row gutter={24}>
          <Col span={24}>
            <h5>缓存账号</h5>
          </Col>
          <form onSubmit={e => this.formSubmit(e, true)}>
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
          <Col span={24}>
            <h5>会被用于投票的账号</h5>
          </Col>
          <Col span={24}>
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
                  <Option key={`${item.token} ${idx}`} value={item.token}>{item.remark}</Option>
                ))
              }
            </Select>
          </Col>
          <Col span={24}>
            <h5>搜索用户</h5>
          </Col>
          <form onSubmit={this.searchSubmit.bind(this)}>
            <Col span={6}>
              <Input name="keyward" placeholder="搜索关键字" />
            </Col>
            <Col span={6}>
              <button className="ant-btn ant-btn-primary" type="submit">搜索</button>
            </Col>
          </form>
          <Col span={24}>
            {
              list.length !== 0
                ? list.map(item => (
                  <div key={item.card.card_id} className={styles.card}>
                    <div className={styles['card-img']}>
                      <img src={`${item.card.cover_url}`} alt={item.role.name} />
                    </div>
                    <div className={styles['card-body']}>
                      <div className={styles['card-title']}>
                        {item.card.fields.find(fields => fields.key === 'name').value}
                      </div>
                      <div className={styles['card-votes']}>
                        <span>{this.toThousands(item.votes)}</span>
                        票
                      </div>
                      <div>
                        <form onSubmit={this.formSubmit.bind(this)}>
                          <input type="hidden" name="cardid" value={item.card.card_id} />
                          <input type="hidden" name="cardname" value={item.card.fields.find(fields => fields.key === 'name').value} />
                          <button type="submit" className={styles['card-button']}>
                            一键投票
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                ))
                : <div>no result</div>
            }
          </Col>
        </Row>
      </div>
    );
  }
}
