import React, { PureComponent } from 'react';
import Axios from 'axios';
import styles from './styles.css';

export default class Home extends PureComponent {
  state = {
    cacheList: [],
    searchResult: {
      count: 0,
      list: [],
    },
  }

  componentWillMount() {
    const data = localStorage.getItem('cache');
    if (data) {
      this.setState({ cacheList: JSON.parse(data) });
    }
  }

  async voteRequest(cardid, token) {
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
      console.log(data);
    } catch (error) {
      console.log('Vote Request', error);
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
    const { cardid } = e.target;
    const { cacheList } = this.state;
    return cacheList.map(item => this.voteRequest(cardid.value, item.token));
  }

  async searchSubmit(e) {
    try {
      e.preventDefault();
      const { keyward } = e.target;
      const { data } = await Axios.get(`https://api-tanka.tictalk.com/activity/super_fit_star_2018/search/?keyword=${keyward.value}&page=1&per_page=20`);
      this.setState({ searchResult: data.result });
    } catch (error) {
      console.log(error);
    }
  }

  toThousands(n) {
    return (n || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1, ');
  }

  render() {
    const { cacheList, searchResult: { list } } = this.state;
    return (
      <div>
        <div>
          <h5>缓存账号</h5>
          <form onSubmit={e => this.formSubmit(e, true)}>
            <input name="token" placeholder="账号token" />
            <input name="remark" placeholder="备注" />
            <button type="submit">Save</button>
          </form>
        </div>
        <div>
          <h5>搜索用户</h5>
          <form onSubmit={this.searchSubmit.bind(this)}>
            <input name="keyward" />
          </form>
        </div>
        <div>
          <h5>会被用于投票的账号</h5>
          <select>
            {
              cacheList.length !== 0
                ? cacheList.map((item, idx) => (
                  <option key={`${item.token} ${idx}`} value={item.token}>{item.remark}</option>
                ))
                : <option selected disabled>no select</option>
            }
          </select>
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
                        <button type="submit" className={styles['card-button']}>
                          Pick Ta
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))
              : <div>no result</div>
          }
        </div>
      </div>
    );
  }
}
