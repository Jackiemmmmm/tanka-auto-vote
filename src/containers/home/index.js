import React, { PureComponent } from 'react';
import Axios from 'axios';
import { Row, Col, Input, notification, Layout } from 'antd';
import Timer from './timer';
import CacheAccount from './cache-account';
import MultipleSelect from './multiple-select';
import styles from './styles.css';

const { Header, Footer, Content } = Layout;

export default class Votes extends PureComponent {
  state = {
    cacheList: [],
    defaultCacheList: [],
    list: [],
    settimeoutMap: {},
  }

  setData = {};

  componentWillMount() {
    const data = localStorage.getItem('cache');
    if (data) {
      this.setState({ cacheList: JSON.parse(data), defaultCacheList: JSON.parse(data) });
    }
  }

  formSubmit = (e, bol = false) => {
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
    this.showArr = cacheList.map(() => false);
    return cacheList.map((item, idx) => this.voteRequest({
      cardid: cardid.value,
      item,
      length: cacheList.length,
      name: cardname.value,
      idx,
    }));
  }

  selectCallback = cacheList => this.setState({ cacheList })

  async fakeShareWeixin({ cardid, item, length, name }) {
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
            Authorization: `Token ${item.token}`,
          },
        },
      );
      if (data) this.voteRequest({ cardid, item, length, name }, true);
    } catch (error) {
      notification.error({
        message: '分享失败',
        description: error.message,
      });
    }
  }

  async voteRequest({ cardid, item, length, name, idx = null }, bol = false) {
    try {
      if (idx !== null) {
        if (!this.setData[cardid]) {
          this.setData[cardid] = [{ cardid, item, name }];
        } else {
          const d = this.setData[cardid];
          d.push({ cardid, item, name });
          this.setData = Object.assign({}, this.setData, {
            [cardid]: d,
          });
        }
        this.showArr[idx] = true;
        if (this.showArr.filter(i => !i).length === 0) {
          this.setState(() => ({
            settimeoutMap: { ...this.setData },
          }));
        }
      }
      const { data } = await Axios.post(
        'https://api-tanka.tictalk.com/vote',
        {
          activity_name: 'fit_star_rank',
          target_id: cardid,
        },
        {
          headers: {
            Authorization: `Token ${item.token}`,
          },
        },
      );
      notification.success({
        message: '投票成功',
        description: `已用${length}个账号为用户${name}投票`,
      });
      const { list } = this.state;
      return this.setState({
        list: list.map((child) => {
          if (child.card.card_id === cardid) {
            return Object.assign({}, child, {
              votes: child.votes + data.result.votes,
            });
          }
          return child;
        }),
      }, () => {
        if (!bol) this.voteRequest({ cardid, item, length, name });
      });
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.code === 711) {
        return this.fakeShareWeixin({ cardid, item, length, name });
      }
      return notification.error({
        message: '投票失败',
        description: error.response && error.response.data.message,
      });
    }
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
    const { list, settimeoutMap, defaultCacheList } = this.state;
    return (
      <Layout style={{ height: '100%' }}>
        <Header className={styles.header}>简化操作工具</Header>
        <Content className={styles.content}>
          <div>
            <Row gutter={24}>
              <CacheAccount formSubmit={e => this.formSubmit(e, true)} />
              <Col span={24}>
                <h5>会被用于投票的账号</h5>
              </Col>
              <Col span={24}>
                <MultipleSelect cacheList={defaultCacheList} selectCallback={this.selectCallback} />
              </Col>
              <Col span={24}>
                <h5>定时投票用户</h5>
              </Col>
              <Col span={24}>
                {Object.values(settimeoutMap).map(item => (
                  <Timer key={item[0].cardid} item={item} callback={obj => this.voteRequest(obj)} />
                ))}
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
                            { '票' }
                          </div>
                          <div>
                            <form onSubmit={this.formSubmit.bind(this)}>
                              <input type="hidden" name="cardid" value={item.card.card_id} />
                              <input type="hidden" name="cardname" value={item.card.fields.find(fields => fields.key === 'name').value} />
                              <button type="submit" className={styles['card-button']}>
                                {'一键投票'}
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
        </Content>
        <Footer className={styles.footer}>
          {'作者：'}
          {/* Jackie.Tu */}
        </Footer>
      </Layout>
    );
  }
}
