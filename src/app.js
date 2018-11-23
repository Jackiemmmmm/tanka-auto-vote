import React from 'react';
import {
  Route as BasicRoute,
  Switch,
  Router,
  // Redirect,
} from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { createBrowserHistory } from 'history';
import NoMatch from 'containers/no-match';
import Layout from 'containers/layout';
import Loading from 'components/loading';
import 'common/common.css';

class AsyncComponent extends React.Component {
  static Component = null;

  constructor(props) {
    super(props);
    this.state = { Component: null };
  }

  componentWillMount() {
    const { Component } = this.state;
    if (!Component) {
      this._rerenderComponent();
    }
  }

  componentWillReceiveProps() {
    if (module.hot) {
      setImmediate(() => this._rerenderComponent());
    }
  }

  _rerenderComponent() {
    const { getComponent } = this.props;
    return getComponent().then((Component) => {
      this.setState({ Component });
    }, () => {
      this.setState({ Component: NoMatch });
    });
  }

  render() {
    const { Component } = this.state;
    if (Component) {
      return <Component {...this.props} />;
    }
    return <Loading />;
  }
}

const asyncComponent = getComponent => props => (
  <AsyncComponent getComponent={getComponent} {...props} />
);

const Home = asyncComponent(() => import(/* webpackChunkName: "Home" */'containers/home').then(module => module.default));

const history = createBrowserHistory();

/**
const Route = ({ path, exact, component: Component }) => (
  <BasicRoute
    exact={exact}
    path={path}
    render={(props) => {
      const { location } = props;
      const loggedIn = localStorage.getItem('loggedIn');
      if (!loggedIn) {
        return <Redirect to={{ pathname: '/', prevPath: location.pathname }} />;
      }
      return <Component {...props} />;
    }}
  />
);
*/

const App = () => (
  <Router history={history}>
    <Layout>
      <Switch>
        <BasicRoute exact path="/" component={Home} />
        <BasicRoute component={NoMatch} />
      </Switch>
    </Layout>
  </Router>
);

export default hot(module)(App);
