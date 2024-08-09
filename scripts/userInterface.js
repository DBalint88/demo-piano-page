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
  
export async function loadSong(e) {
    splash.style.display = "none";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.src = this.dataset.pdf + "#zoom=118&navpanes=0&pagemode=none";
    videoLink.href = this.dataset.video;
    pdfLink.href = this.dataset.pdf +"#zoom=83";
    currentSongFbref = this.dataset.fbref
    currentSongTitle = this.textContent
    currentSongLevel = parseInt(this.dataset.level)
    currentSongSeq = parseInt(this.dataset.seq)
    currentSongValue = determineSongValue(currentSongLevel)
    currentSongAttempts = await countCurrentSongAttempts()
    console.log('loadSong says: currentSongAttempts = ', currentSongAttempts)
    updateButtons(); 
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