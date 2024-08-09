export function activateUI(backButton, homeButton, submitButton) {
    backButton.addEventListener("click", hideSongList);
    homeButton.addEventListener("click", goHome);
    submitButton.addEventListener("click", submitSong);
}