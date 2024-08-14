import { activateUI, callSongList, hideSongList, adjustListPosition, goHome, updateButtons, updateQuotaDisplay, updateSongListLive, clearData, loadSong, determineSongValue } from './userInterface.js'
import { comps } from './comps.js';
import { songData } from './songData.js';
import { submissionBank } from './submissionBank.js';
import { userProfile, updateUserLevel } from './userProfile.js';
import { setWeek } from './setWeek.js';
import { instructorModal, instructorChoice } from './instructorModal.js';
import { getSongs, printSongsList } from './printSongsList.js';
import { updateStatusLights } from './updateStatusLights.js';

import { displayState } from './displayState.js'

// Set the week number (All submissions are due Friday of each week.)
displayState.currentWeek = setWeek();
activateUI(comps, displayState, userProfile, submissionBank);

comps.loginButton.addEventListener("click", function() {
  setTimeout(() => {
    let userSongs = getSongs(userProfile, songData);
    printSongsList(comps, userSongs, callSongList, determineSongValue, userProfile.handicap,  loadSong, displayState, userProfile);
  }, 400);
  
})
// GENERATE THE SONG CONTENT TO THE PAGE

// updateStatusLights();

// CLICK EVENTS TO SHOW / HIDE LEVELS AND SONGS, AND SUBMIT A SONG FOR REVIEW

// UPDATE USER'S LEVEL
// If a user's completedSongs array includes ALL of the songs with level == the user's level
//      then their level should increment.
// Related, but possibly a separate funtion:
// If a user's completedSongs array U pendingSongs array includes ALL of the songs with level == user's level
// They should be given access to the next level of songs.

// LOGGIN IN & LOGGIN OUT




// onAuthStateChanged(auth, async (user) => {
//   // Logic for when the user logs in. If succesful and profile exists, get userLevel & song arrays 
//   if (user) {
//     loginButton.style.display = 'none'

//     // Refer to the userProfile with the same ID as the user.
//     userID = user.uid
    

//     try {
//       // Subscribe to snapshots of userProfile doc
//       const docRef = doc(db, "userProfiles", userID)
//       let docSnap = await getDoc(docRef);
//       if(!docSnap.exists()) {
//         await setDoc(doc(db, "userProfiles", userID), {
//           firstName: (user.displayName).split(" ")[0],
//           lastName: (user.displayName).split(" ")[1],
//           level: 1,
//           role: "student",
//           nick: "",
//           completedSongs: [],
//           pendingSongs: [],
//           failedSongs: [],
//           handicap: 1,
//           userLvl9: "false",
//           instructor: ""
//         })
//         docSnap = await getDoc(docRef);
//       }
      
//       await updateDoc(docRef, {
//         firstName: (user.displayName).split(" ")[0],
//         lastName: (user.displayName).split(" ")[1]
//       })
      

//       onSnapshot(docRef, (doc) => {
//         getUserData(doc)
//         updateStatusLights()
//         updateButtons()
//         updateQuotaDisplay()
//       })
      
//       
      


//       getUserData(docSnap)
//       const quotaMax = document.getElementsByClassName("quota-max");
//       if (userLvl9 == true) {
//         for (let i = 0; i < quotaMax.length; i++) {
//           quotaMax[i].innerText = "90"
//         }
//       }
//       await getSongs()

//     }
//     catch(error) {
//       console.log(error)
//     }
    
//   } else {
//     console.log('no user logged in')
//     
//   }
// });