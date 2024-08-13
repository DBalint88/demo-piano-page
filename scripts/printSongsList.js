// FETCH SONGS APPROPRIATE TO THE USER'S LEVEL

export function getSongs(userProfile, songData) {
  let userSongs = [];
  for (let i=0; i < userProfile.level; i++) {
    let levelList = [];
      
    for (let song of songData) {
      if (song.level == (i+1)) {
        levelList.push(song);
      }
    }
    userSongs.push(levelList)
    
  }
  return userSongs;
}

  //   window.window['level' + i] = []
  //   let q = query(songsRef, where("level", "==", i), orderBy("sequence"))
  //   await getDocs(q)
  //   .then((snapshot) => {
  //     snapshot.docs.forEach((doc) => {
  //       window['level' + i].push({ ...doc.data(), id: doc.id })
  //     })
  //     songs.push(window['level' + i])
  //     console.log("getSongs says: ", window['level' + i])
  //   })
  // }
//   updateUserLevel()
//   if (x == userLevel) {
//     updateSongListLive()
//     printSongs
//   }
//   printSongs()
// }


export function printSongsList (navListWrapper, userSongs, callSongList, determineSongValue, handicap, loadSong, displayState, backButton) {
    let levelList = document.createElement('div')
    levelList.setAttribute('id', 'level-list')
    let levelUl = document.createElement('ul')
    levelUl.setAttribute('id', 'level-ul')
    navListWrapper.appendChild(levelList)
    levelList.appendChild(levelUl)
  
    for (let i=7; i <= userSongs.length; i++) {
  
      // Print the level list
      let levelButton = document.createElement('li')
      levelButton.classList.add("level-button")
      levelButton.setAttribute("id", i)
      levelButton.textContent = 'Level ' + i
      levelUl.appendChild(levelButton)
      levelButton.addEventListener('click', function(event) {
        const e = event.target.id;
        callSongList(e, displayState, levelList, backButton)
      });
  
      let songsContainer = document.createElement("div")
      songsContainer.classList.add('song-list')
      songsContainer.setAttribute("id", 'level-'+i)
  
      let levelHeader = document.createElement("h2")
      levelHeader.textContent = 'Level ' + i
  
      let levelValueHeader = document.createElement('h4')
      levelValueHeader.textContent = '(' + determineSongValue(i, handicap) + ' points each)'
  
      let levelOl = document.createElement("ol")
  
      navListWrapper.appendChild(songsContainer)
      songsContainer.appendChild(levelHeader)
      songsContainer.appendChild(levelValueHeader)
      songsContainer.appendChild(levelOl)
  
  
      // Print the song buttons
      
      for(let j=0; j<userSongs[i-1].length; j++) {
        let song = document.createElement("li");
        song.classList.add("song-button")
        let songSrc = userSongs[i-1][j]
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