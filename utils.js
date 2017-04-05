const gameWidth = 800
const directions = ['left', 'right']

module.exports = {
  // Return random position between the game size (0px to 800px)
  playerPosition: () => {
    return Math.floor((Math.random() * gameWidth) + 1)
  },
  // Return random hexadecimal color string for player color
  playerColor: () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16)
  },
  undeadDirection: () => {
    // 1 chance in 2
    return directions[Math.floor(Math.random() * 2)]
  },
  undeadPosition: (direction) => {
    return (direction === 'left') ? 0 : gameWidth
  }
}
