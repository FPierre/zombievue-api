const test = require('ava')

const { playerColor } = require('../../../src/utils')

test('success', t => {
  const colors = []

  colors.push(playerColor())
  colors.push(playerColor())
  colors.push(playerColor())
  colors.push(playerColor())
  colors.push(playerColor())

  const allStartSharp = colors.every(c => c.startsWith('#'))
  const allEq7 = colors.every(c => c.length == 7)

  t.true(allStartSharp)
  t.true(allEq7)
})
