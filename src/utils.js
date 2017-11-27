const gameWidth = 800
const directions = ['left', 'right']

module.exports = {
  // Return random position between the game size (0px to 800px)
  playerPosition: () => Math.floor((Math.random() * gameWidth) + 1),

  // Return random hexadecimal color string for player color
  playerColor: () => '#' + Math.floor(Math.random() * 16777215).toString(16)
}
