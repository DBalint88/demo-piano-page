import { determineSongValue } from "./userInterface.js";
import { clearData } from "./userInterface.js";

// FETCH SONGS APPROPRIATE TO THE USER'S LEVEL

export function getSongs(level, songData) {
  let userSongs = [];
  for (let i=0; i < level; i++) {
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


export function printSongsList (comps, displayState, userProfile, callSongList, loadSong) {
    let levelList = document.createElement('div')
    levelList.setAttribute('id', 'level-list')
    let levelUl = document.createElement('ul')
    levelUl.setAttribute('id', 'level-ul')
    comps.navListWrapper.appendChild(levelList)
    levelList.appendChild(levelUl)
  
    for (let i=7; i <= userProfile.viewableSongs.length; i++) {
  
      // Print the level list
      let levelButton = document.createElement('li')
      levelButton.classList.add("level-button")
      levelButton.setAttribute("id", i)
      levelButton.textContent = 'Level ' + i
      levelUl.appendChild(levelButton)
      levelButton.addEventListener('click', function(event) {
        const e = event.target.id;
        callSongList(e, displayState, levelList, comps)
      });
  
      let songsContainer = document.createElement("div")
      songsContainer.classList.add('song-list')
      songsContainer.setAttribute("id", 'level-'+i)
  
      let levelHeader = document.createElement("h2")
      levelHeader.textContent = 'Level ' + i
  
      let levelValueHeader = document.createElement('h4')
      levelValueHeader.textContent = '(' + determineSongValue(i, userProfile.handicap) + ' points each)'
  
      let levelOl = document.createElement("ol")
  
      comps.navListWrapper.appendChild(songsContainer)
      songsContainer.appendChild(levelHeader)
      songsContainer.appendChild(levelValueHeader)
      songsContainer.appendChild(levelOl)
  
  
      // Print the song buttons
      
      for(let j=0; j<userProfile.viewableSongs[i-1].length; j++) {
        let song = document.createElement("li");
        song.classList.add("song-button")
        let songSrc = userProfile.viewableSongs[i-1][j]
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
        song.addEventListener('click', function(event) {
          const e = event.target;
          loadSong(e, displayState, comps, userProfile);
        });
  
      }
    }
  }

  export function checkUserProgress(comps, userProfile, songData) {
    let allCurrentLevelSongs = []
    
    for (const song of userProfile.viewableSongs[userProfile.level - 1])  {
        if (song.level == userProfile.level) {
          allCurrentLevelSongs.push(song.fbRef)
        }
    }
  
    console.log("allCurrentLevelSongs = " + allCurrentLevelSongs);
  
    let completedSongsPlusPendingSongs = userProfile.completedSongs.concat(userProfile.pendingSongs)
    console.log("completedSongsPlusPendingSongs = " +completedSongsPlusPendingSongs)
  
    function checker(arr, target) {
      return target.every(function (arr, v) {
          return arr.includes(v);
        });
    }
  
    // if all of the songs at the user's current level are COMPLETE, user's level is advanced and the song list re-loaded.
    if (checker(userProfile.completeSongs, allCurrentLevelSongs)) {
      userProfile.level += 1;
      clearData(comps)
      getSongs(userProfile.level, songData)
    // if all of the songs at the user's current level are either complete or pending, and at least some are pending, user should be granted access to the next level, without advancing their profile level.
    } else if (checker(completedSongsPlusPendingSongs, allCurrentLevelSongs)) {
      clearData(comps)
      getSongs(userProfile.level, songData)
    }
  }