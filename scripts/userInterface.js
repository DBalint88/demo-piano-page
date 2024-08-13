export function activateUI(comps, displayState) {
    comps.loginButton.addEventListener('click', () => {
      loginButton.style.display = 'none'
      loadingGif.style.display = 'block'
      })
    comps.logoutButton.addEventListener('click', () => {
      splashGreeting.innerText = "Please log in with your Hamden.org account."
    })
    comps.backButton.addEventListener("click", function() {
      hideSongList(displayState, comps)
      });
    comps.homeButton.addEventListener("click", goHome);
    // submitButton.addEventListener("click", submitSong);
}


export  function callSongList(e, displayState, levelList, comps) {
    displayState.currentActiveLevel = e;
    let currentActiveSongList = document.getElementById("level-" + e);
    levelList.classList.add("inactive-level-list");
    currentActiveSongList.classList.add('song-list-loading')
    setTimeout(function(){
      currentActiveSongList.classList.add("active-song-list")
      currentActiveSongList.classList.remove('song-list-loading')
      comps.backButton.classList.add("back-button-active") 
      // adjustListPosition()
    }, 1) 
}

export function hideSongList(displayState, comps) {
    let currentActiveSongList = document.getElementById("level-" + displayState.currentActiveLevel)
    // song-list-loading needs to be added FIRST THING.  That allows the list to display.
    // Immediately, active-song-list must be removed.  That creates the transition.
    // 250ms later, song-list-loading needs to be removed to reduce the navlistwrapper size.
    currentActiveSongList.classList.add('song-list-loading')
    currentActiveSongList.classList.remove("active-song-list")
    currentActiveSongList.classList.remove("active-song-list-short-screen")
    document.getElementById("level-list").classList.remove("inactive-level-list");
    comps.backButton.classList.remove("back-button-active") 
    setTimeout(function(){
      currentActiveSongList.classList.remove('song-list-loading')
      
    }, 250) 
    displayState.currentActiveLevel = ""
}
  
export async function loadSong(e, displayState, comps) {
    comps.splash.style.display = "none";
    comps.iframe.style.width = "100%";
    comps.iframe.style.height = "100%";
    console.log(e);
    comps.iframe.src = e.dataset.pdf + "#zoom=118&navpanes=0&pagemode=none";
    comps.videoLink.href = e.dataset.video;
    comps.pdfLink.href = e.dataset.pdf +"#zoom=83";
    displayState.currentSongFbref = e.dataset.fbref
    displayState.currentSongTitle = e.textContent
    displayState.currentSongLevel = parseInt(e.dataset.level)
    displayState.currentSongSeq = parseInt(e.dataset.seq)
    console.log("title: " + displayState.currentSongTitle)
    console.log("level: " + displayState.currentSongLevel)
    console.log("seq: " + displayState.currentSongSeq)
    console.log("fbref: " + displayState.currentSongFbref)
    // // currentSongValue = determineSongValue(currentSongLevel)
    // // currentSongAttempts = await countCurrentSongAttempts()
    // console.log('loadSong says: currentSongAttempts = ', currentSongAttempts)
    // updateButtons(); 
}
  
export function adjustListPosition() {
    let wrapperHeight = navListWrapper.clientHeight;

    setTimeout(function(){
        try {
        let songList = document.getElementsByClassName('active-song-list')[0]
        if (typeof songList == "undefined") {
            songList = document.getElementsByClassName('active-song-list-short-screen')[0]
        }
        console.log(songList)
        let songListHeight = songList.clientHeight;

        if (wrapperHeight >= songListHeight) {
            console.log('wrapperHeight (' + wrapperHeight + ') >= songListHeight (' + songListHeight + ')')
            songList.classList.remove('active-song-list-short-screen')
            songList.classList.add('active-song-list')
        } else {
            console.log('wrapperHeight (' + wrapperHeight + ') !>= songListHeight (' + songListHeight + ')')
            songList.classList.remove('active-song-list')
            songList.classList.add('active-song-list-short-screen')
        }
        } catch {
        console.log("can't get the height of a div that don't exist.")
        }
    }, 1)  
}
  
export function handleWindowSize(window) {
    window.addEventListener('resize', adjustListPosition);
}

export function goHome() {
    iframe.style.width = '0';
    iframe.style.height = '0';
    videoLink.href = ''
    pdfLink.href = ''
    splash.style.display = "block";
    currentSongFbref = ''
    currentSongTitle = ''
    currentSongLevel = 0
    currentSongValue = 0
    currentSongAttempts = 0
    updateButtons();
}

// CONTROL APPEARANCE OF YT, PDF, HOME, & SUBMIT BUTTONS
export function updateButtons() {
  if (currentSongFbref == '') {
    videoIcon.style.opacity = ".2"
    videoLink.style.pointerEvents="none"
    pdfIcon.style.opacity = ".2"
    pdfLink.style.pointerEvents="none"
    submitButton.style.opacity = ".2"
    submitButton.style.pointerEvents="none"
  } else {
    videoIcon.style.opacity = "1"
    videoLink.style.cursor = "pointer"
    videoLink.style.pointerEvents = "auto"
    pdfIcon.style.opacity = "1"
    pdfLink.style.cursor = "pointer"
    pdfLink.style.pointerEvents = "auto"
    submitButton.style.pointerEvents="auto"
    if (completedSongs.includes(currentSongFbref)) {
      submitButton.src = "images/upload-icon.png"
      submitButton.style.opacity = ".2"
      submitButton.style.cursor = "default"
    } else if (pendingSongs.includes(currentSongFbref)) {
      submitButton.src = "images/undo-icon.png"
      submitButton.style.opacity = "1"
      submitButton.style.cursor = "pointer"
    } else {
      submitButton.src = "images/upload-icon.png"
      submitButton.style.opacity = "1"
      submitButton.style.cursor = "pointer"
    }
  }
}

// UPDATE THE QUOTA DISPLAY
export async function updateQuotaDisplay() {
    let currentWeekAttempted = 0
    let currentWeekEarned = 0
    let userCurrentWeekSubs = []
    const quotaQuery = query(subsRef, where("userID", "==", userID), where("week", "==", currentWeek))
    await getDocs(quotaQuery)
      .then((snapshot) => {
        snapshot.docs.forEach((sub) => {
          userCurrentWeekSubs.push({ ...sub.data(), id: sub.id })
        })
      })
    for (let i = 0; i < userCurrentWeekSubs.length; i++) {
      const sub = userCurrentWeekSubs[i];
      if (sub.resolved == false) {
        currentWeekAttempted += sub.pointValue
      } else if (sub.result == "pass") {
        currentWeekEarned += sub.pointValue
      }
    }
    
    
    document.getElementById("points-attempted").innerText = currentWeekAttempted;
    document.getElementById("points-earned").innerText = currentWeekEarned;
  }

  export async function updateSongListLive() {
    let allCurrentLevelSongs = []
    songs[userLevel-1].forEach((element) => allCurrentLevelSongs.push(element.id))
    let allCurrentLevelSubmissions = completedSongs.concat(pendingSongs)
  
    let checker = (arr, target) => target.every(v => arr.includes(v));
  
    if (checker(allCurrentLevelSubmissions, allCurrentLevelSongs)) {
      let temp = userLevel + 1
      const docRef = doc(db, 'userProfiles', userID)
      let docSnap = await getDoc(docRef);
      clearData()
      getUserData(docSnap)
      getSongs(temp)
    } 
  }

  // CLEAR DATA ON LOG OUT, OR TO RESET PAGE ON LEVEL CHANGES
export function clearData() {
    backButton.classList.remove("back-button-active")
    while (navListWrapper.firstChild) {
      navListWrapper.removeChild(navListWrapper.firstChild)
    }
    pendingSongs = []
    completedSongs = []
    failedSongs = []
    userLevel = null;
    songs = []
  }