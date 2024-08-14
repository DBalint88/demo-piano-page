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
      // retractSubmission()
    }

  } else if (failedSongs.includes(currentSongFbref)) {
    if (confirm("Are you sure you want to resubmit " + currentSongTitle + "?")) {
      pendingSongs.push(currentSongFbref)
      submissionBank.push(createSubmission(displayState, userProfile))
      updateButtons(comps, displayState, userProfile);
      // if (currentSongLevel == userLevel) {
      //   // updateSongListLive()
      // }
    }

  } else if (!completedSongs.includes(currentSongFbref)) {
    if (confirm("Are you sure you want to submit " + currentSongTitle + "?")) {
      pendingSongs.push(currentSongFbref)
      submissionBank.push(createSubmission(displayState, userProfile))
      updateButtons(comps, displayState, userProfile);
      // if (currentSongLevel == userLevel) {
      //   // updateSongListLive()
      // }
    }
  }
}

export function createSubmission(displayState, userProfile) {
    return {
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
export async function countCurrentSongAttempts() {
    // Query the database for all user Submissions
    let userSubmissions = []
    const countQuery = query(subsRef, where("userID", "==", userID))
    await getDocs(countQuery)
      .then((snapshot) => {
        snapshot.docs.forEach((sub) => {
          userSubmissions.push(sub.id)
        })
      })
    console.log('countCurrentSongAttempts 336 userSubmissions: ', userSubmissions)
    let i = 1
    while (true) {
      console.log('countCurrentSongAttempts while loop.  Eval: ' + userID + currentSongFbref + '(' + i + ')')
      if (userSubmissions.includes(userID + currentSongFbref + '(' + i + ')')) {
        i++
      } else {
        console.log('countCurrentSongAttempts line343 returns: ', (i-1))
        return (i-1);
      }
    }
}



export async function postSubmission() {
    console.log('createSubmission 484: Trying to create sub doc: ', userID+currentSongFbref+'('+(currentSongAttempts+1)+')')
    await setDoc(doc(db, "submissions", userID+currentSongFbref+'('+(currentSongAttempts+1)+')'), {
        resolved: false,
        result: '',
        timeStamp: serverTimestamp(),
        week: currentWeek,
        userID: userID,
        lastName: userLastName,
        firstName: username,
        songfbRef: currentSongFbref,
        songLevel: currentSongLevel,
        songSeq: currentSongSeq,
        songTitle: currentSongTitle,
        pointValue: currentSongValue,
        instructor: instructor
      })
      currentSongAttempts = await countCurrentSongAttempts()
      console.log('createSubmission says: currentSongAttempts = ', currentSongAttempts)
      console.log('submission sent successfully: ', userID+currentSongFbref+'('+(currentSongAttempts)+')')
}

export async function retractSubmission() {
    console.log('trying to delete: ', userID+currentSongFbref+'(' + currentSongAttempts + ')')
    await deleteDoc(doc(db, "submissions", userID+currentSongFbref+'(' + currentSongAttempts + ')'))
    currentSongAttempts = await countCurrentSongAttempts()
    console.log('retractSubmission says: currentSongAttempts = ', currentSongAttempts)
    console.log('submission deleted successfully.')
}