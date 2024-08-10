export function printSongsList (navListWrapper) {
    let levelList = document.createElement('div')
    levelList.setAttribute('id', 'level-list')
    let levelUl = document.createElement('ul')
    levelUl.setAttribute('id', 'level-ul')
    navListWrapper.appendChild(levelList)
    levelList.appendChild(levelUl)
  
    for (let i=1; i <= songData.length; i++) {
  
      // Print the level list
      let levelButton = document.createElement('li')
      levelButton.classList.add("level-button")
      levelButton.setAttribute("id", i)
      levelButton.textContent = 'Level ' + i
      levelUl.appendChild(levelButton)
      levelButton.addEventListener('click', callSongList)
  
      let songsContainer = document.createElement("div")
      songsContainer.classList.add('song-list')
      songsContainer.setAttribute("id", 'level-'+i)
  
      let levelHeader = document.createElement("h2")
      levelHeader.textContent = 'Level ' + i
  
      let levelValueHeader = document.createElement('h4')
      levelValueHeader.textContent = '(' + determineSongValue(i) + ' points each)'
  
      let levelOl = document.createElement("ol")
  
      navListWrapper.appendChild(songsContainer)
      songsContainer.appendChild(levelHeader)
      songsContainer.appendChild(levelValueHeader)
      songsContainer.appendChild(levelOl)
  
  
      // Print the song buttons
      for(let j=0; j<window['level' + i].length; j++) {
        let song = document.createElement("li");
        song.classList.add("song-button")
        let songSrc = songData[i-1][j]
        song.setAttribute("data-level", i)
        song.setAttribute("data-seq", (j+1))
        song.setAttribute("data-pdf", songSrc.image)
        song.setAttribute("data-video", songSrc.youtube)
        song.setAttribute("data-fbref", songSrc.fbRef)
        song.textContent = songSrc.title
  
        // Print the status icons
        
        let statusIcon = document.createElement('img')
        statusIcon.setAttribute('src', 'images/default-status-icon.png')
        statusIcon.setAttribute('id', songSrc.fbRef)
        statusIcon.classList.add('status-icon')
  
        levelOl.appendChild(song)
        song.appendChild(statusIcon)
        song.addEventListener('click', loadSong)
  
      }
    }
  }