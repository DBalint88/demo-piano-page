export function updateStatusLights() {
    let statusIcons = Array.from(document.getElementsByClassName('status-icon'))
    statusIcons.forEach((el) => {
      el.style.setProperty('background-color', 'black')
      if (userProfile.completedSongs.includes(el.id)) {
        el.style.setProperty('background-color', 'lime')
      }
      if (userProfile.failedSongs.includes(el.id)) {
        el.style.setProperty('background-color', 'red')
      }
      if (userProfile.pendingSongs.includes(el.id)) {
        el.style.setProperty('background-color', 'yellow')
      }
    })
  }