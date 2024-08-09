export function activateUI(backButton, homeButton, submitButton) {
    backButton.addEventListener("click", hideSongList);
    homeButton.addEventListener("click", goHome);
    submitButton.addEventListener("click", submitSong);
}


export  function callSongList(e) {
    currentActiveLevel = this.id
    let currentActiveSongList = songList[currentActiveLevel-1]
    levelList.classList.add("inactive-level-list");
    currentActiveSongList.classList.add('song-list-loading')
    setTimeout(function(){
      currentActiveSongList.classList.add("active-song-list")
      currentActiveSongList.classList.remove('song-list-loading')
      backButton.classList.add("back-button-active") 
      adjustListPosition()
    }, 1) 
}

export function hideSongList() {
    let currentActiveSongList = songList[currentActiveLevel-1]
    // song-list-loading needs to be added FIRST THING.  That allows the list to display.
    // Immediately, active-song-list must be removed.  That creates the transition.
    // 250ms later, song-list-loading needs to be removed to reduce the navlistwrapper size.
    currentActiveSongList.classList.add('song-list-loading')
    currentActiveSongList.classList.remove("active-song-list")
    currentActiveSongList.classList.remove("active-song-list-short-screen")
    levelList.classList.remove("inactive-level-list");
    backButton.classList.remove("back-button-active") 
    setTimeout(function(){
      currentActiveSongList.classList.remove('song-list-loading')
      
    }, 250) 
    currentActiveLevel = ""
}
  
 