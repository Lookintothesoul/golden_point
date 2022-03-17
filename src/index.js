import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'
import { App } from './App'
import { initTooltip } from './utils/helpers'

initTooltip()

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)
