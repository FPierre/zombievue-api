const { broadcast, emit } = require('./socket-actions')
const { players, undeads } = require('./game')

const hitboxWatch = () => {
  // TODO: to implement
  const playerHitboxWidth = 60
  const undeadHitboxWidth = 60

  players.forEach(player => {
    undeads.forEach(undead => {
      if ((player.x + playerHitboxWidth > undead.x) && (player.x < undead.x + undeadHitboxWidth)) {
        // Collision
        console.log('Collision')

        broadcast('hitbox', {
          playerId: player.id,
          undeadId: undead.id
        })

        // setTimeout(() => {
        //   state.hit = true
        // }, 100)
      }
    })
  })
}

module.exports = {
  hitboxWatch
}
