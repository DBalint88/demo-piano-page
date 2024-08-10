import { songData } from './songData.js';
import { createSubmission, determineSongValue, countCurrentSongAttempts, submitSong, postSubmission, retractSubmission } from './createSubmission.js';
import { userProfile, updateUserLevel } from './userProfile.js';
import { setWeek } from './setWeek.js';
import { instructorModal, instructorChoice } from './instructorModal.js';
import { printSongsList } from './printSongsList.js';
import { updateStatusLights } from './updateStatusLights.js';
import { activateUI, callSongList, hideSongList, adjustListPosition, handleWindowSize, goHome, updateButtons, updateQuotaDisplay, updateSongListLive, clearData } from './userInterface.js'
import { displayState } from './displayState.js'

// DOM references
// TO-DO: Test how many of these can be 'const'
let songList = document.getElementsByClassName("song-list");
let iframe = document.getElementById("iframe");
let splash = document.getElementById("splash");
let videoLink = document.getElementById("video-link");
let videoIcon = document.getElementById("yt-icon")
let pdfLink = document.getElementById("pdf-link");
let pdfIcon = document.getElementById("pdf-icon")
let homeButton = document.getElementById("home-button");
let backButton = document.getElementById("back-button");
let submitButton = document.getElementById("submit-button");
const navListWrapper = document.getElementById("nav-list-wrapper");
let levelList;
let levelUl;
const loginButton = document.getElementById("googleSignIn")
const logoutButton = document.getElementById("signoutButton")
const loadingGif = document.getElementById("loading-gif")
let splashGreeting = document.getElementById("splash-greeting")
let balintButton = document.createElement("button")
let rossButton = document.createElement("button")


// Set the week number (All submissions are due Friday of each week.)
const currentWeek = setWeek();

// Fetch user data from FireStore -> LOCAL  <<NOT NECESSARY FOR DEMO>>

// function getUserData(docSnap) {
//   userLevel = docSnap.get("level")
//   pendingSongs = docSnap.get("pendingSongs")
//   completedSongs = docSnap.get("completedSongs")
//   failedSongs = docSnap.get("failedSongs")
//   handicap = docSnap.get("handicap")
//   userLvl9 = docSnap.get("userLvl9")
//   instructor = docSnap.get("instructor")
//   console.log("instructor: " + instructor)
//   if (instructor != "balint" && instructor != "rossomando") {
//     console.log("ah jeez idk who the instructor is.")
//     confirmInstructor()
//   }
// }

// Confirm the instructor, initiate the modal if necessary.
if (userProfile.instructor != "balint" && userProfile.instructor != "rossomando") {
    instructorModal(balintButton, rossButton);
    instructorChoice(balintButton, rossButton);
}

/*
What I want is ...

Fetch the songs for the user's level. So if uLevel is 2, fetch sLevels 1 and 2.
Check - has the uLevel 2 user submitted all the songs from Level 2?
        If so, clear the data and re-run the fetch function at level 3 (without actually uLevel++).  
        Then printSongs().
        If not, just printSongs.
        It seems like maybe the if condition from updateSongListLive() needs to be brought up to the main
        getSongs function.

*/

// FETCH SONGS APPROPRIATE TO THE USER'S LEVEL
// async function getSongs(x = userLevel) {
//   console.log("getSongs says: x = ", x)
//   for (let i=1; i <= x; i++) {
//     window.window['level' + i] = []
//     let q = query(songsRef, where("level", "==", i), orderBy("sequence"))
//     await getDocs(q)
//     .then((snapshot) => {
//       snapshot.docs.forEach((doc) => {
//         window['level' + i].push({ ...doc.data(), id: doc.id })
//       })
//       songs.push(window['level' + i])
//       console.log("getSongs says: ", window['level' + i])
//     })
//   }
//   updateUserLevel()
//   if (x == userLevel) {
//     updateSongListLive()
//     printSongs
//   }
//   printSongs()
// }

// GENERATE THE SONG CONTENT TO THE PAGE
printSongsList(navListWrapper);
updateStatusLights();
handleWindowSize()
// CLICK EVENTS TO SHOW / HIDE LEVELS AND SONGS, AND SUBMIT A SONG FOR REVIEW
activateUI();

// UPDATE USER'S LEVEL
// If a user's completedSongs array includes ALL of the songs with level == the user's level
//      then their level should increment.
// Related, but possibly a separate funtion:
// If a user's completedSongs array U pendingSongs array includes ALL of the songs with level == user's level
// They should be given access to the next level of songs.

// LOGGIN IN & LOGGIN OUT


loginButton.addEventListener('click', () => {
  loginButton.style.display = 'none'
  loadingGif.style.display = 'block'
  })
logoutButton.addEventListener('click', () => {
  splashGreeting.innerText = "Please log in with your Hamden.org account."
})

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
      
//       username = (user.displayName).split(" ")[0];  
//       let nick = await docSnap.get("nick")
//       if (!nick == "") {
//         username = nick
//       }
//       userLastName = (user.displayName).split(" ")[1]

      

        
//       const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
//       const d = new Date();
//        let day = weekday[d.getDay()];
//       splashGreeting.innerText = (`Happy ${day}, ${username}! Please click a Level on the left to get started.`)
      

//       loadingGif.style.display = 'none'
//       logoutButton.style.display = 'block'

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
//     loginButton.style.display = 'flex'
//     logoutButton.style.display = 'none'
//     clearData()
//     userID = ''
//   }
// });