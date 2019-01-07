import * as Sentry from '@sentry/browser';
import React from 'react';
import PropTypes from 'prop-types';

export default class ErrorBoundry extends React.Component {
  constructor (props) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch (error, errorInfo) {
    this.setState({ error });
    Sentry.withScope(scope => {
      const uName = localStorage.getItem('userName');
      if (uName) {
        scope.setUser({ 'username': localStorage.getItem('userName') });
      } else {
        scope.setUser({ 'ip_address': '' });
      }
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });
      Sentry.captureException(error);
    });
  }

  render () {
    if (this.state.error) {
      // render fallback UI
      if (process.env.NODE_ENV === 'production') {
        Sentry.showReportDialog();
        return null;
      } else {
        return this.props.children;
      }
    } else {
      // when there's not an error, render children untouched
      return this.props.children;
    }
  }
}
ErrorBoundry.propTypes = {
  children: PropTypes.node
}

;
