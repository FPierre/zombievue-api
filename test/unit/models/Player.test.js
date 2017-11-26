const test = require('ava')

const Player = require('../../../src/models/Player')

test.beforeEach(t => {
  t.context.player = new Player(1, 'axe-warrior')
})

test('', t => {
  const { player } = t.context

  t.is(player.id, 1)
  t.is(player.direction, 'left')
  t.is(player.state, 'idle')
  t.is(player.type, 'axe-warrior')
})

test('', t => {
  const { player } = t.context

  const position = player.x

  player.left()

  t.is(player.direction, 'left')
  t.is(player.state, 'walk')
  t.is(player.x, position - 3)
})

test('', t => {
  const { player } = t.context

  const position = player.x

  player.right()

  t.is(player.direction, 'right')
  t.is(player.state, 'walk')
  t.is(player.x, position + 3)
})

test('', t => {
  const { player } = t.context

  player.idle()

  t.is(player.state, 'idle')
})

test('', t => {
  const { player } = t.context

  player.attack()

  t.is(player.state, 'attack')
})
