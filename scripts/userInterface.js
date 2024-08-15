import { createSubmission, countCurrentSongAttempts, submitSong, retractSubmission } from './createSubmission.js';
import { updateStatusLights } from './updateStatusLights.js';

export function activateUI(comps, displayState, userProfile, submissionBank, songData) {
    
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
      submitSong(comps, displayState, userProfile, submissionBank, songData);
    });
    comps.logoutButton.addEventListener("click", () => {
    });
    window.addEventListener('resize', () => {
      adjustListPosition(comps);
    });
  
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
    displayState.currentSongValue = determineSongValue(displayState.currentSongLevel, userProfile.handicap)
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
  console.log("updateButtons fired!")
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
      console.log("completedSongs includes currentSongFbref")
      comps.submitButton.src = "images/upload-icon.png"
      comps.submitButton.style.opacity = ".2"
      comps.submitButton.style.cursor = "default"
    } else if (userProfile.pendingSongs.includes(displayState.currentSongFbref)) {
      console.log("pendingSongs includes currentSongFbref")
      comps.submitButton.src = "images/undo-icon.png"
      comps.submitButton.style.opacity = "1"
      comps.submitButton.style.cursor = "pointer"
    } else {
      console.log("failedSongs includes currentSongFbref, or no arrays do.")
      comps.submitButton.src = "images/upload-icon.png"
      comps.submitButton.style.opacity = "1"
      comps.submitButton.style.cursor = "pointer"
    }
  }
}

// UPDATE THE QUOTA DISPLAY
export function updateQuotaDisplay(displayState, userProfile, submissionBank) {
    let attempted = 0;
    let earned = 0;

    for (const sub of submissionBank) {
      if (sub.userID == userProfile.userID && sub.week == displayState.currentWeek && sub.result == "") {
        attempted += sub.pointValue;
      }
      if (sub.userID == userProfile.userID && sub.week == displayState.currentWeek && sub.result == "pass") {
        earned += sub.pointValue;
      }
    }

    document.getElementById("points-attempted").innerText = attempted;
    document.getElementById("points-earned").innerText = earned;
  }


  // CLEAR DISPLAY ON LOG OUT, OR TO RESET PAGE ON LEVEL CHANGES
export function clearData(comps) {
    comps.backButton.classList.remove("back-button-active")
    while (comps.navListWrapper.firstChild) {
      comps.navListWrapper.removeChild(comps.navListWrapper.firstChild)
    }
    // Quota display:
    document.getElementById("points-attempted").innerText = "";
    document.getElementById("points-earned").innerText = "";
}

//  DETERMINE POINT VALUE OF CURRENT SONG TOWARDS WEEKLY QUOTA
export function determineSongValue(songLevel, handicap) {
  switch (songLevel) {
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