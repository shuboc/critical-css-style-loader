import React, {PropTypes} from 'react'

// Provide `insertCss()` as context.
// The function is called back with styles as arguments
// when a component decorated with `withStyles` is about to be rendered.

class IsomorphicStyleContext extends React.Component {
  getChildContext() {
    const {insertCss} = this.props
    return {insertCss}
  }

  render() {
    return <div>{this.props.children}</div>
  }
}

IsomorphicStyleContext.propTypes = {
  children: PropTypes.node.isRequired,
  insertCss: PropTypes.func
}

IsomorphicStyleContext.childContextTypes = {
  insertCss: PropTypes.func
}

export default IsomorphicStyleContext
