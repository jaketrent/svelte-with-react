import React from 'react'
import { render } from 'react-dom'

import Badge from './badge.html'

// based on https://github.com/jihchi/react-svelte-components/blob/master/index.js
class ReactBadge extends React.Component {
  initialize(node) {
    if (!node) return

    this._instance = new Badge({
      target: node,
      data: this.props
    })
  }
  componentWillUnmount() {
    this._instance.teardown()
  }
  componentWillReceiveProps(nextProps) {
    this._instance.set(nextProps)
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    return React.createElement('div', { ref: this.initialize.bind(this) })
  }
}

export default _ => (
  <div>
    <h1>React app with Svelte component</h1>
    <ReactBadge color="orange">Amazing</ReactBadge>
  </div>
)
