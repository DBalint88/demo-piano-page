export function buildSubmissionLists(comps, submissionBank, userProfile) {
    for (const sub of submissionBank) {
        if (sub.resolved == false) {
            console.log("buildSubmissionLists:");
            console.log(sub);
            let record = document.createElement('tr')

            let timeStamp = document.createElement('td')
            timeStamp.textContent = sub.timeStamp.toLocaleDateString('en-us', { weekday: "short", month: "short", day: "numeric"  })
            timeStamp.classList.add("center-align")

            let week = document.createElement('td')
            week.textContent = sub.week
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
                processFeedback(sub.submissionID, sub.songfbRef, gradeForm.passfail.value, userProfile, submissionBank)
                wipeSubmissionDisplay(comps)
                buildSubmissionLists(comps, submissionBank)
            })

            gradeFormCell.appendChild(gradeForm)
            gradeForm.appendChild(formInputPass)
            gradeForm.appendChild(formLabelPass)
            gradeForm.appendChild(formInputFail)
            gradeForm.appendChild(formLabelFail)
            gradeForm.appendChild(formButton)

            comps.unresolvedRecordWrapper.appendChild(record)
            record.appendChild(timeStamp)
            record.appendChild(week)
            record.appendChild(lastName)
            record.appendChild(firstName)
            record.appendChild(songLevel)
            record.appendChild(songSeq)
            record.appendChild(songTitle)
            record.appendChild(pointValue)
            record.appendChild(gradeFormCell)

        } else if (sub.resolved == true) {

            let record = document.createElement('tr')

            let timeStamp = document.createElement('td')
            timeStamp.textContent = sub.timeStamp.toLocaleDateString('en-us', { weekday: "short", month: "short", day: "numeric" })
            timeStamp.classList.add("center-align")

            let resolvedTimeStamp = document.createElement('td')
            resolvedTimeStamp.textContent = sub.timeStamp.toLocaleDateString('en-us', { weekday: "short", month: "short", day: "numeric" })
            resolvedTimeStamp.classList.add("center-align")

            let result = document.createElement('td')
            result.textContent = sub.result.toUpperCase()
            if (sub.result == 'pass') {
                result.style.backgroundColor = 'darkgreen'
            } else if (sub.result == 'fail') {
                result.style.backgroundColor = 'darkred'
            }
            result.classList.add("center-align")

            let week = document.createElement('td')
            week.textContent = sub.week
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

            let undoButton = document.createElement('button')
            undoButton.textContent = "Undo"
            undoButton.addEventListener("click", (event) => {
                event.preventDefault()
                // undoFeedback(sub.id, sub.songfbRef, sub.userID, sub.result)
            })

            gradeForm.appendChild(undoButton)
            gradeFormCell.appendChild(gradeForm)


            comps.resolvedRecordWrapper.appendChild(record)
            record.appendChild(timeStamp)
            record.appendChild(resolvedTimeStamp)
            record.appendChild(result)
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

export function processFeedback(id, songfbRef, passfail, userProfile, submissionBank) {

    userProfile.pendingSongs.splice(userProfile.pendingSongs.indexOf(songfbRef), 1)

    if (passfail == "pass") {
        if (userProfile.failedSongs.includes(songfbRef)) {
            userProfile.failedSongs.splice(userProfile.failedSongs.indexOf(songfbRef), 1)
        }
        userProfile.completedSongs.push(songfbRef)

        for (let sub of submissionBank) {
            console.log("pass! ")
            console.log(sub)
            if (sub.submissionID = id) {
                sub.resolved = true;
                sub.result = "pass";
                sub.timeStap = new Date();
            }
            console.log("pass!2 ")
            console.log(sub)
        }
    }

    if (passfail == "fail") {
        if (!userProfile.failedSongs.includes(songfbRef)) {
            userProfile.failedSongs.push(songfbRef)
        }
        for (let sub of submissionBank) {
            if (sub.submissionID = id) {
                sub.resolved = true;
                sub.result = "fail";
                sub.timeStap = new Date();
            }
        }
    }
}

export function wipeSubmissionDisplay(comps) {
    while(comps.unresolvedRecordWrapper.children.length > 1) {
        comps.unresolvedRecordWrapper.removeChild(comps.unresolvedRecordWrapper.lastChild)
    }
}