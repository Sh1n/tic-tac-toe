import angular from 'angular'

var TicTacToeGame = angular
  .module('TicTacToe', [])
  .filter('range', function () {
    return function (input, total) {
      total = parseInt(total)
      for (var i = 0; i < total; input.push(i++));
      return input
    }
  })
  .directive('gameGridCell', function () {
    return {
      restrict: 'E',
      replace: true,
      template: require('./gameGridCell.html'),
      scope: {
        content: '=?'
      }
    }
  })
  .directive('gameGrid', function () {
    return {
      restrict: 'E',
      replace: true,
      template: require('./gameGrid.html'),
      scope: {
        size: '=?'
      },
      controller: ['$scope', function ($scope) {
        $scope.size = $scope.size || 3
        var moves = 0

        $scope.restart = function () {
          moves = 0
          $scope.dots = {}
          $scope.classes = {}
          $scope.currentFlag = 'O'
          $scope.result = false
          $scope.endGame = false
        }
        $scope.restart()

        var toggleFlag = function () {
          $scope.currentFlag = $scope.currentFlag === 'X' ? 'O' : 'X'
        }

        var highlightEndGame = function (resultObject) {
          if ('row' in resultObject) {
            if (!(resultObject.row in $scope.classes)) {
              $scope.classes[resultObject.row] = {}
            }
            for (var colIndex = 0; colIndex < $scope.size; colIndex++) {
              $scope.classes[resultObject.row][colIndex] = 'active'
            }
          }
          if ('col' in resultObject) {
            for (var rowIndex = 0; rowIndex < $scope.size; rowIndex++) {
              if (!(rowIndex in $scope.classes)) {
                $scope.classes[rowIndex] = {}
              }
              $scope.classes[rowIndex][resultObject.col] = 'active'
            }
          }
          if ('diag' in resultObject && resultObject.diag === 1) {
            for (var diagIndex = 0; diagIndex < $scope.size; diagIndex++) {
              if (!(diagIndex in $scope.classes)) {
                $scope.classes[diagIndex] = {}
              }
              $scope.classes[diagIndex][diagIndex] = 'active'
            }
          }
          if ('diag' in resultObject && resultObject.diag === -1) {
            for (diagIndex = 0; diagIndex < $scope.size; diagIndex++) {
              if (!(diagIndex in $scope.classes)) {
                $scope.classes[diagIndex] = {}
              }
              colIndex = ($scope.size - 1) - diagIndex
              $scope.classes[diagIndex][colIndex] = 'active'
            }
          }
        }

        var rowCheck = function (row, col, flag) {
          for (var colIndex = 0; colIndex < $scope.size; colIndex++) {
            if ($scope.dots[row][colIndex] !== flag) {
              break
            }
            if (colIndex === $scope.size - 1) {
              return {
                result: true,
                type: 'win',
                row: row,
                flag: flag
              }
            }
          }
          return {
            result: false
          }
        }

        var colCheck = function (row, col, flag) {
          for (var rowIndex = 0; rowIndex < $scope.size; rowIndex++) {
            if (!(rowIndex in $scope.dots)) {
              break
            }
            if ($scope.dots[rowIndex][col] !== flag) {
              break
            }
            if (rowIndex === $scope.size - 1) {
              return {
                result: true,
                type: 'win',
                col: col,
                flag: flag
              }
            }
          }
          return {
            result: false
          }
        }

        var computeDiagonalIndex = function (colIndex, direction) {
          return direction === -1 ? (($scope.size - 1) - colIndex) : colIndex
        }

        var diagCheck = function (row, col, flag, direction) {
          for (var diagIndex = 0; diagIndex < $scope.size; diagIndex++) {
            var colIndex = computeDiagonalIndex(diagIndex, direction)
            if (!(diagIndex in $scope.dots)) {
              break
            }
            if (!(colIndex in $scope.dots[diagIndex])) {
              break
            }
            if ($scope.dots[diagIndex][colIndex] !== flag) {
              break
            }
            if (diagIndex === $scope.size - 1) {
              return {
                result: true,
                type: 'win',
                diag: direction,
                flag: flag
              }
            }
          }
          return {
            result: false
          }
        }

        var manageEndGame = function (resultObject) {
          if (resultObject.result === false) {
            return
          }
          if (resultObject.type === 'draw') {
            $scope.result = 'Draw'
          }
          if (resultObject.type === 'win') {
            $scope.result = 'Player ' + resultObject.flag + ' Wins'
            highlightEndGame(resultObject)
          }
          $scope.endGame = true
        }

        var checkEndGame = function (row, col, flag) {
          var checkResult = rowCheck(row, col, flag)
          if (checkResult.result) {
            manageEndGame(checkResult)
          }
          checkResult = colCheck(row, col, flag)
          if (checkResult.result) {
            manageEndGame(checkResult)
          }
          if (row === col) {
            checkResult = diagCheck(row, col, flag, 1)
            if (checkResult.result) {
              manageEndGame(checkResult)
            }
          }
          if (row + col === $scope.size - 1) {
            checkResult = diagCheck(row, col, flag, -1)
            if (checkResult.result) {
              manageEndGame(checkResult)
            }
          }

          if (moves === (Math.pow($scope.size, 2))) {
            manageEndGame({
              result: true,
              type: 'draw'
            })
          }
        }

        $scope.updateCell = function (row, col) {
          if ($scope.endGame) {
            return
          }
          moves++
          $scope.moves = moves
          if (!(row in $scope.dots)) {
            $scope.dots[row] = {}
          }
          if (!(col in $scope.dots[row])) {
            $scope.dots[row][col] = $scope.currentFlag
            toggleFlag()
          }
          checkEndGame(row, col, $scope.dots[row][col])
        }
      }]
    }
  })

export default TicTacToeGame
