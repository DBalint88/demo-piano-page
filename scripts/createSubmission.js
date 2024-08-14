import { updateButtons } from "./userInterface.js";

export function submitSong(comps, displayState, userProfile, submissionBank) {

  let pendingSongs = userProfile.pendingSongs;
  let failedSongs = userProfile.failedSongs;
  let completedSongs = userProfile.completedSongs;

  let currentSongFbref = displayState.currentSongFbref;
  let currentSongTitle = displayState.currentSongTitle

  if (pendingSongs.includes(currentSongFbref)) {
    if (confirm("Are you sure you want to unsubmit " + currentSongTitle + "?")) {
      pendingSongs.splice(pendingSongs.indexOf(currentSongFbref), 1)
      updateButtons(comps, displayState, userProfile);
      retractSubmission(displayState, userProfile, submissionBank);
    }

  } else if (failedSongs.includes(currentSongFbref)) {
    if (confirm("Are you sure you want to resubmit " + currentSongTitle + "?")) {
      pendingSongs.push(currentSongFbref)
      submissionBank.push(createSubmission(displayState, userProfile, submissionBank))
      updateButtons(comps, displayState, userProfile);
      // if (currentSongLevel == userLevel) {
      //   // updateSongListLive()
      // }
    }

  } else if (!completedSongs.includes(currentSongFbref)) {
    if (confirm("Are you sure you want to submit " + currentSongTitle + "?")) {
      pendingSongs.push(currentSongFbref)
      submissionBank.push(createSubmission(displayState, userProfile, submissionBank))
      console.log(submissionBank);
      updateButtons(comps, displayState, userProfile);
      // if (currentSongLevel == userLevel) {
      //   // updateSongListLive()
      // }
    }
  }
}

export function createSubmission(displayState, userProfile, submissionBank) {
    console.log(userProfile.userID + displayState.currentSongFbref + "("+ countCurrentSongAttempts(displayState, userProfile, submissionBank) +")")
    return {
        submissionID: userProfile.userID + displayState.currentSongFbref + "("+ countCurrentSongAttempts(displayState, userProfile, submissionBank) +")",
        userID: userProfile.userID,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        instructor: userProfile.instructor,
        pointValue: displayState.currentSongValue,
        resolved: false,
        result: "",
        songLevel: displayState.currentSongLevel,
        songSeq: displayState.currentSongSeq,
        songTitle: displayState.currentSongTitle,
        songfbRef: displayState.currentSongFbref,
        timeStamp: new Date(),
        week: displayState.currentWeek
    }
}



// Submissions need to be named userId + songID + attempts
export function countCurrentSongAttempts(displayState, userProfile, submissionBank) {
    // Query the database for all user Submissions of this song.
    let userSubmissions = []
    for (const sub of submissionBank) {
      if (sub.userID == userProfile.userID && sub.songfbRef == displayState.currentSongFbref) {
        userSubmissions.push(sub);
      }
    }
    return userSubmissions.length + 1;
}

export function retractSubmission(displayState, userProfile, submissionBank) {

    console.log('trying to delete: ', userProfile.userID+displayState.currentSongFbref+'(' + (countCurrentSongAttempts(displayState, userProfile, submissionBank)-1) + ')')
    let result = "";
    for (const sub of submissionBank) {
      if (sub.submissionID == userProfile.userID+displayState.currentSongFbref+'(' + (countCurrentSongAttempts(displayState, userProfile, submissionBank)-1) + ')') {
          result = sub
      }
    }

    submissionBank.splice(submissionBank.indexOf(result), 1)
    console.log('retractSubmission says: currentSongAttempts = ', countCurrentSongAttempts(displayState, userProfile, submissionBank))
    console.log('submission deleted successfully.')
}