import { createSubmission, countCurrentSongAttempts, submitSong, postSubmission, retractSubmission } from './createSubmission.js';

export function activateUI(comps, displayState, userProfile, submissionBank) {
    comps.loginButton.addEventListener('click', () => {
      logIn(comps, userProfile)
    })
    comps.logoutButton.addEventListener('click', () => {
      comps.splashGreeting.innerText = "Please log in to your fake demo account:"

      comps.logoutButton.style.display = 'none'
      comps.loginButton.style.display = 'flex'

      clearData(comps)
    })
    comps.backButton.addEventListener("click", function() {
      hideSongList(displayState, comps)
      });
    comps.homeButton.addEventListener("click", function() {
      goHome(comps, displayState, userProfile)
    });
    comps.submitButton.addEventListener("click", function() {
      submitSong(displayState, userProfile, submissionBank);
    });
    comps.logoutButton.addEventListener("click", () => {
    });
    window.addEventListener('resize', () => {
      adjustListPosition(comps);
    });
  
}

export function logIn(comps, userProfile) {
    comps.loginButton.style.display = 'none'
    comps.loadingGif.style.display = 'block'
    setTimeout(function() {
      comps.loadingGif.style.display = 'none';
      comps.logoutButton.style.display = 'flex'
      adjustListPosition(comps)
    }, 400)   

    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const d = new Date();
      let day = weekday[d.getDay()];
    comps.splashGreeting.innerText = (`Happy ${day}, ${userProfile.nick}! Please click a Level on the left to get started.`)
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
      adjustListPosition(comps)
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
  
export function loadSong(e, displayState, comps, userProfile) {
    comps.splash.style.display = "none";
    comps.iframe.style.width = "100%";
    comps.iframe.style.height = "100%";
    comps.iframe.src = e.dataset.pdf + "#zoom=118&navpanes=0&pagemode=none";
    comps.videoLink.href = e.dataset.video;
    comps.pdfLink.href = e.dataset.pdf +"#zoom=83";
    displayState.currentSongFbref = e.dataset.fbref
    displayState.currentSongTitle = e.textContent
    displayState.currentSongLevel = parseInt(e.dataset.level)
    displayState.currentSongSeq = parseInt(e.dataset.seq)
    // // currentSongValue = determineSongValue(currentSongLevel)
    // // currentSongAttempts = await countCurrentSongAttempts()
    // console.log('loadSong says: currentSongAttempts = ', currentSongAttempts)
    updateButtons(comps, displayState, userProfile); 
}
  
export function adjustListPosition(comps) {
    let wrapperHeight = comps.navListWrapper.clientHeight;

    setTimeout(function(){
        try {
        let songList = document.getElementsByClassName('active-song-list')[0]
        if (typeof songList == "undefined") {
            songList = document.getElementsByClassName('active-song-list-short-screen')[0]
        }
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
  


export function goHome(comps, displayState, userProfile) {
    comps.iframe.style.width = '0';
    comps.iframe.style.height = '0';
    comps.videoLink.href = ''
    comps.pdfLink.href = ''
    comps.splash.style.display = "block";
    displayState.currentSongFbref = ''
    displayState.currentSongTitle = ''
    displayState.currentSongLevel = 0
    displayState.currentSongValue = 0
    displayState.currentSongAttempts = 0
    updateButtons(comps, displayState, userProfile);
}

// CONTROL APPEARANCE OF YT, PDF, HOME, & SUBMIT BUTTONS
export function updateButtons(comps, displayState, userProfile) {
  if (displayState.currentSongFbref == '') {
    comps.videoIcon.style.opacity = ".2"
    comps.videoLink.style.pointerEvents="none"
    comps.pdfIcon.style.opacity = ".2"
    comps.pdfLink.style.pointerEvents="none"
    comps.submitButton.style.opacity = ".2"
    comps.submitButton.style.pointerEvents="none"
  } else {
    comps.videoIcon.style.opacity = "1"
    comps.videoLink.style.cursor = "pointer"
    comps.videoLink.style.pointerEvents = "auto"
    comps.pdfIcon.style.opacity = "1"
    comps.pdfLink.style.cursor = "pointer"
    comps.pdfLink.style.pointerEvents = "auto"
    comps.submitButton.style.pointerEvents="auto"
    if (userProfile.completedSongs.includes(displayState.currentSongFbref)) {
      comps.submitButton.src = "images/upload-icon.png"
      comps.submitButton.style.opacity = ".2"
      comps.submitButton.style.cursor = "default"
    } else if (userProfile.pendingSongs.includes(displayState.currentSongFbref)) {
      comps.submitButton.src = "images/undo-icon.png"
      comps.submitButton.style.opacity = "1"
      comps.submitButton.style.cursor = "pointer"
    } else {
      comps.submitButton.src = "images/upload-icon.png"
      comps.submitButton.style.opacity = "1"
      comps.submitButton.style.cursor = "pointer"
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
export function clearData(comps) {
    comps.backButton.classList.remove("back-button-active")
    while (comps.navListWrapper.firstChild) {
      comps.navListWrapper.removeChild(comps.navListWrapper.firstChild)
    }
}

//  DETERMINE POINT VALUE OF CURRENT SONG TOWARDS WEEKLY QUOTA
export function determineSongValue(x, handicap) {
  switch (x) {
    case 7:
      return 15 * handicap
    case 8:
      return 20 * handicap
    case 9:
      return 30 * handicap
    default:
      return 60
  }
}