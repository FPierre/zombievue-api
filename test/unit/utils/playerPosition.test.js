const test = require('ava')

const { playerPosition } = require('../../../src/utils')

test('success', t => {
  const positions = []

  positions.push(playerPosition())
  positions.push(playerPosition())
  positions.push(playerPosition())
  positions.push(playerPosition())
  positions.push(playerPosition())

  const allGt0 = positions.every(p => p >= 0)
  const allLt800 = positions.every(p => p <= 800)

  t.true(allGt0)
  t.true(allLt800)
})
