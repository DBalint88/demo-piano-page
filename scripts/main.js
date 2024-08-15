import { activateUI, callSongList, hideSongList, adjustListPosition, goHome, updateButtons, updateQuotaDisplay, clearData, loadSong, determineSongValue } from './userInterface.js'
import { comps } from './comps.js';
import { songData } from './songData.js';
import { submissionBank } from './submissionBank.js';
import { userProfile } from './userProfile.js';
import { setWeek } from './setWeek.js';
import { instructorModal, instructorChoice } from './instructorModal.js';
import { getSongs, printSongsList, checkUserProgress } from './printSongsList.js';
import { updateStatusLights } from './updateStatusLights.js';
import { displayState } from './displayState.js'

// View Swapping functionality:

let viewStatus = 'student';


comps.viewSwapButton.addEventListener('click', function() {
  if (viewStatus == 'student') {
    comps.studentContentWrapper.style.display = 'none';
    comps.teacherContentWrapper.style.display = 'block';
    comps.viewSwapButton.innerText = 'Click for Student View'
    viewStatus = 'teacher';
  } else if (viewStatus =='teacher') {
    comps.teacherContentWrapper.style.display = 'none';
    comps.studentContentWrapper.style.display = 'grid';
    comps.viewSwapButton.innerText = 'Click for Teacher View'
    viewStatus = 'student';
  }
});

//Teacher view script:

const unresolvedRecordWrapper = document.getElementById("unresolved-record-wrapper")
const resolvedRecordWrapper = document.getElementById("resolved-record-wrapper")

function buildActiveList() {
  for (sub of submissionBank) {
    if (sub.resolved = false) {
      let record = document.createElement('tr')

        let timeStamp = document.createElement('td')
        timeStamp.textContent = sub.timeStamp.toDate().toLocaleDateString('en-us', { weekday: "short", month: "short", day: "numeric"  })
        timeStamp.classList.add("center-align")

        let week = document.createElement('td')
        week.textContent = sub.week - 22
        week.classList.add("center-align")

        let lastName = document.createElement('td')
        lastName.textContent = sub.lastName
        lastName.classList.add("left-align")

        let firstName = document.createElement('td')
        firstName.textContent = sub.firstName
        firstName.classList.add("left-align")

        let songLevel = document.createElement('td')
        songLevel.textContent = sub.songLevel
        songLevel.classList.add("center-align")

        let songSeq = document.createElement('td')
        songSeq.textContent = sub.songSeq
        songSeq.classList.add("center-align")

        let songTitle = document.createElement('td')
        songTitle.textContent = sub.songTitle
        songTitle.classList.add("center-align")
        
        let pointValue = document.createElement('td')
        pointValue.textContent = sub.pointValue
        pointValue.classList.add("center-align")

        let gradeFormCell = document.createElement('td')
        gradeFormCell.classList.add("center-align")
        let gradeForm = document.createElement('form')

        let formLabelPass = document.createElement('label')
        formLabelPass.setAttribute("for", "pass")
        formLabelPass.textContent = "Pass"
        let formInputPass = document.createElement('input')
        formInputPass.setAttribute("type", "radio")
        formInputPass.setAttribute("name", "passfail")
        formInputPass.setAttribute("value", "pass")
        formInputPass.required = true

        let formLabelFail = document.createElement('label')
        formLabelFail.setAttribute("for", "fail")
        formLabelFail.textContent = "Fail"
        let formInputFail = document.createElement('input')
        formInputFail.setAttribute("type", "radio")
        formInputFail.setAttribute("name", "passfail")
        formInputFail.setAttribute("value", "fail")

        let formButton = document.createElement('button')
        formButton.textContent = "Confirm"
        gradeForm.addEventListener("submit", (event) => {
            event.preventDefault();
            // processFeedback(event, sub.id, sub.songfbRef, sub.userID, gradeForm.passfail.value)
        })

        gradeFormCell.appendChild(gradeForm)
        gradeForm.appendChild(formInputPass)
        gradeForm.appendChild(formLabelPass)
        gradeForm.appendChild(formInputFail)
        gradeForm.appendChild(formLabelFail)
        gradeForm.appendChild(formButton)

        unresolvedRecordWrapper.appendChild(record)
        record.appendChild(timeStamp)
        record.appendChild(week)
        record.appendChild(lastName)
        record.appendChild(firstName)
        record.appendChild(songLevel)
        record.appendChild(songSeq)
        record.appendChild(songTitle)
        record.appendChild(pointValue)
        record.appendChild(gradeFormCell)
    }
  }


}



// Set the week number (All submissions are due Friday of each week.)
displayState.currentWeek = setWeek();
activateUI(comps, displayState, userProfile, submissionBank, songData, callSongList, loadSong, printSongsList);
comps.loginButton.addEventListener('click', () => {
  comps.loginButton.style.display = 'none'
  comps.loadingGif.style.display = 'block'
  setTimeout(function() {
    comps.loadingGif.style.display = 'none';
    comps.logoutButton.style.display = 'flex'
    userProfile.viewableSongs = getSongs(userProfile.level, songData);
    printSongsList(comps, displayState, userProfile, callSongList, loadSong);
    if (checkUserProgress(comps, userProfile, songData, displayState)) {
      printSongsList (comps, displayState, userProfile, callSongList, loadSong)
      updateStatusLights(userProfile);
      updateQuotaDisplay(displayState, userProfile, submissionBank);
    }
    updateQuotaDisplay(displayState, userProfile, submissionBank)
    updateStatusLights(userProfile);
    adjustListPosition(comps)
  }, 400)   

  const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const d = new Date();
    let day = weekday[d.getDay()];
  comps.splashGreeting.innerText = (`Happy ${day}, ${userProfile.nick}! Please click a Level on the left to get started.`)
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