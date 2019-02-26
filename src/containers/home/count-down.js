import React, { PureComponent } from 'react';

export default class CountDown extends PureComponent {
  state = {
    minutes: 0,
    seconds: 0,
  }

  componentWillMount() {
    const { time } = this.props;
    const timeSplit = time.split(',');
    this.setState({
      minutes: timeSplit[0],
      seconds: timeSplit[1],
    }, () => {
      this.settimeoutFunc({ minutes: timeSplit[0], seconds: timeSplit[1] });
    });
  }

  settimeoutFunc = ({ minutes: min, seconds: sec }) => {
    setTimeout(() => {
      const minutes = Number(min);
      const seconds = Number(sec);
      if (seconds !== 0) {
        const s = seconds - 1;
        const getSeconds = s < 10 ? `0${s}` : s;
        return this.setState({ seconds: getSeconds }, () => {
          this.settimeoutFunc({ minutes, seconds: getSeconds });
        });
      }
      if (minutes === 0 && seconds === 0) return this.setState({ minutes: 0, seconds: 0 });
      const m = minutes - 1;
      const getMinutes = m < 10 ? `0${m}` : m;
      const getSeconds = 60;
      return this.setState({
        minutes: getMinutes,
        seconds: getSeconds,
      }, () => {
        this.settimeoutFunc({ minutes: getMinutes, seconds: getSeconds });
      });
    }, 1000);
  }

  render() {
    const { minutes, seconds } = this.state;
    return (
      <span>
        {minutes}
        {'分'}
        {seconds}
        {'秒'}
      </span>
    );
  }
}
