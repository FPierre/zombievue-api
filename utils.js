module.exports = {
  // Return random position between the game size (0px to 800px)
  randomPosition: () => {
    return Math.floor((Math.random() * 800) + 1)
  },
  // Return hexadecimal color string for player color
  randomColor: () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16)
  }
}
