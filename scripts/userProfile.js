export let userProfile = {
    firstName: "Cameron",
    lastName: "Doe",
    nick: "Cam",
    instructor: "balint",
    handicap: 1,
    level: 7,
    pendingSongs: [],
    failedSongs: [],
    completedSongs: []
}

export async function updateUserLevel() {

    let allCurrentLevelSongs = []
    songs[userLevel-1].forEach((element) => allCurrentLevelSongs.push(element.id))
  
    let checker = (arr, target) => target.every(v => arr.includes(v));
  
    if (checker(completedSongs, allCurrentLevelSongs)) {
      userLevel++
      const docRef = doc(db, 'userProfiles', userID)
      let docSnap = await getDoc(docRef);
      updateDoc(docRef, {
        level: userLevel
      })
      clearData()
      getUserData(docSnap)
      getSongs()
    }
  }