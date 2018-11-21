import React, { PureComponent } from 'react';
import { Card } from 'antd';
import styles from './styles.css';

export default class timer extends PureComponent {
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

  autoVotesUser(time = null, params = null) {
    if (time) {
      setTimeout(() => {
        this.afterTimeoutRun(params);
      }, time);
    } else {
      const { item } = this.props;
      item.map((child, idx) => {
        const getTime = time || this.randomIntFromInterval() + this.checkMinutesInNextHours();
        console.log(`autoVotesUser, 当前时间为：${new Date()}, token${idx}距下次为用户 ${child.name} 投票时间还有${getTime / 60 / 1000}分钟`);
        return setTimeout(() => {
          this.afterTimeoutRun(child, idx);
        }, getTime);
      });
    }
  }

  afterTimeoutRun(child, idx) {
    const { callback } = this.props;
    const randomTime = this.randomIntFromInterval();
    const nextTime = this.checkMinutesInNextHours();
    console.log(`afterTimeoutRun, 当前时间为：${new Date()}, token${idx}距下次为用户 ${child.name} 投票时间还有${(randomTime + nextTime) / 60 / 1000}分钟`);
    callback({
      cardid: child.cardid,
      token: child.token,
      length: 1,
      name: child.name,
    });
    this.autoVotesUser(randomTime + nextTime, child);
  }

  randomIntFromInterval(min = 2, max = 57) {
    return (Math.floor(Math.random() * (max - min + 1) + min) * 60 + Math.floor(Math.random() * (max - min + 1) + min)) * 1000;
  }

  checkMinutesInNextHours() {
    const date = new Date();
    return (60 - date.getMinutes()) * 60 * 1000;
  }

  render() {
    const { item } = this.props;
    return (
      <Card key={item[0].cardid} title={item[0].name} className={styles.timer}>
        <p>
          自动投票用户：
          {item.length}
        </p>
      </Card>
    );
  }
}
