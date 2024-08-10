// All Modal stuff:


export function instructorModal(balintButton, rossButton) {

    let instructorModal = document.createElement("div")
    let modalContent = document.createElement("div")
    let modalParagraph = document.createElement("p")
    let pageBody = document.getElementById("body")

  modalParagraph.textContent = "One-time check: Who is your instructor for this class?"

  instructorModal.classList.add("modal")
  modalContent.classList.add("modal-content")

  balintButton.textContent = "Mr. Balint"
  rossButton.textContent = "Ms. Rossomando-Heise"

  modalContent.appendChild(modalParagraph)
  modalContent.appendChild(balintButton)
  modalContent.appendChild(rossButton)
  instructorModal.appendChild(modalContent)
  pageBody.appendChild(instructorModal)
}

export function instructorChoice(balintButton, rossButton) {

    balintButton.addEventListener("click", () => {
        userProfile.instructor = "balint"
        instructorModal.remove()
        // const docRef = doc(db, 'userProfiles', userID)
        // updateDoc(docRef, {
        //   instructor: instructor,
        // })
      })
      rossButton.addEventListener("click", () => {
        userProfile.instructor = "rossomando"
        instructorModal.remove()
        // const docRef = doc(db, 'userProfiles', userID)
        // updateDoc(docRef, {
        //   instructor: instructor,
        // })
      })
}


