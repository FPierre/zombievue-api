module.exports = {
  // Return random position between the game size (0px to 800px)
  playerPosition: () => {
    return Math.floor((Math.random() * 800) + 1)
  },
  // Return random hexadecimal color string for player color
  playerColor: () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16)
  },
  // Return random name for player name
  playerName: (playerId) => {
    return names = [
      'The Exorcist',
      'The Undertaker',
      'The Punisher',
      'The Impaler',
      'The Crucifier'
    ][playerId]
  }
}
