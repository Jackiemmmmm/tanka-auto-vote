import React, { PureComponent } from 'react';
import { Card } from 'antd';
import styles from './styles.css';
import CountDown from './count-down';

export default class timer extends PureComponent {
  state = {
    list: [],
  }

  componentDidMount() {
    const { item } = this.props;
    console.log('componentDidMount 开启自动投票', item);
    this.autoVotesUser();
  }

  componentDidUpdate(prevProps) {
    const { item } = this.props;
    if (prevProps.item !== item) {
      console.log('componentDidUpdate', prevProps.item, item);
    }
  }

  autoVotesUser(time = null, params = null, index) {
    if (time) {
      this[index] = setTimeout(() => {
        this.afterTimeoutRun(params, index);
      }, time);
    } else {
      const { item } = this.props;
      const refactData = item.map((child, idx) => {
        const getTime = time || this.randomIntFromInterval() + this.checkMinutesInNextHours();
        const data = {
          dateNow: new Date(),
          user: child.item.remark,
          nextTime: this.checkTimestamp(getTime),
          idx,
        };
        this[idx] = setTimeout(() => {
          this.afterTimeoutRun(child, idx);
        }, getTime);
        return data;
      });
      this.setState({ list: refactData });
    }
  }

  afterTimeoutRun(child, idx) {
    const { callback } = this.props;
    const randomTime = this.randomIntFromInterval();
    const nextTime = this.checkMinutesInNextHours();
    console.log(`afterTimeoutRun, 当前时间为：${new Date()}, ${child.item.remark}距下次为用户 ${child.name} 投票时间还有${this.checkTimestamp(randomTime + nextTime)}`);
    callback({
      cardid: child.cardid,
      token: child.item.token,
      length: 1,
      name: child.name,
    });
    const data = {
      dateNow: new Date(),
      user: child.item.remark,
      nextTime: this.checkTimestamp(randomTime + nextTime),
      idx,
    };
    const { list } = this.state;
    const refactList = list;
    refactList.splice(idx, 1, data);
    this.setState({ list: refactList });
    this.autoVotesUser(randomTime + nextTime, child, idx);
  }

  randomIntFromInterval(min = 2, max = 57) {
    return (Math.floor(Math.random() * (max - min + 1) + min) * 60 + Math.floor(Math.random() * (max - min + 1) + min)) * 1000;
  }

  checkMinutesInNextHours() {
    const date = new Date();
    return (60 - date.getMinutes()) * 60 * 1000;
  }

  checkTimestamp(time) {
    const getMinutes = Math.floor(time / 60 / 1000);
    const getSeconds = time / 1000 % 60;
    return `${getMinutes},${getSeconds}`;
  }

  render() {
    const { item } = this.props;
    const { list } = this.state;
    return (
      <Card key={item[0].cardid} title={item[0].name} className={styles.timer}>
        <p style={{ paddingBottom: '10px' }}>
          {'自动投票用户：'}
          {item.length}
        </p>
        {list.map(child => (
          <div className={styles['timer-main']} key={child.idx}>
            <p>
              {child.user}
              {'&nbsp; 距下次投票时间还有 &nbsp;'}
              <CountDown time={child.nextTime} />
            </p>
            <p>
              {'上次投票时间：'}
              {child.dateNow.toLocaleString()}
            </p>
          </div>
        ))}
      </Card>
    );
  }
}
