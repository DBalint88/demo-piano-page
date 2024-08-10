export function createSubmission() {
    return {
        userID: null,
        firstName: "",
        lastName: "",
        instructor: "",
        pointValue: null,
        resolved: false,
        result: "",
        songLevel: null,
        songSeq: null,
        songTitle: "",
        songfbRef: "",
        timeStamp: null,
        week: null
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

export async function submitSong(e) {
    if (pendingSongs.includes(currentSongFbref)) {
      if (confirm("Are you sure you want to unsubmit " + currentSongTitle + "?")) {
        const docRef = doc(db, 'userProfiles', userID)
        pendingSongs.splice(pendingSongs.indexOf(currentSongFbref), 1)
        updateDoc(docRef, {
        pendingSongs: pendingSongs,
        })
        retractSubmission()
      }
  
    } else if (failedSongs.includes(currentSongFbref)) {
      if (confirm("Are you sure you want to resubmit " + currentSongTitle + "?")) {
        const docRef = doc(db, 'userProfiles', userID)
        pendingSongs.push(currentSongFbref)
        updateDoc(docRef, {
        pendingSongs: pendingSongs,
        })
        createSubmission()
        if (currentSongLevel == userLevel) {
          updateSongListLive()
        }
      }
  
    } else if (!completedSongs.includes(currentSongFbref)) {
      if (confirm("Are you sure you want to submit " + currentSongTitle + "?")) {
        pendingSongs.push(currentSongFbref)
        const docRef = doc(db, 'userProfiles', userID)
        updateDoc(docRef, {
        pendingSongs: pendingSongs,
        })
        createSubmission()
        if (currentSongLevel == userLevel) {
          updateSongListLive()
        }
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