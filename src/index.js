import './style.scss'
import angular from 'angular'
import './game'

const pageHtml = require('./base.html')

document.body.innerHTML = pageHtml
angular.bootstrap(document.body, ['TicTacToe'])

// This is needed for Hot Module Replacement
if (module.hot) {
  module.hot.accept()
}
