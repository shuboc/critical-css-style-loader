import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';

const contextTypes = {
  insertCss: PropTypes.func,
};

function withStyles(...styles) {
  return function wrapWithStyles(ComposedComponent) {
    class WithStyles extends Component {
      componentWillMount() {
        this.removeCss = this.context.insertCss.apply(undefined, styles);
      }

      componentWillUnmount() {
        setTimeout(this.removeCss, 0);
      }

      render() {
        return <ComposedComponent {...this.props} />;
      }
    }

    const displayName = ComposedComponent.displayName || ComposedComponent.name || 'Component';

    WithStyles.displayName = `WithStyles(${displayName})`;
    WithStyles.contextTypes = contextTypes;
    WithStyles.ComposedComponent = ComposedComponent;

    return hoistStatics(WithStyles, ComposedComponent);
  };
}

export default withStyles;
