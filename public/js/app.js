const firebaseConfig = {
  apiKey: "AIzaSyBCL_sLLC1TzQRyv1RmbiJrthZ4eJjxvTc",
  authDomain: "thrivemetronome.firebaseapp.com",
  databaseURL: "https://thrivemetronome-default-rtdb.firebaseio.com",
  projectId: "thrivemetronome",
  storageBucket: "thrivemetronome.appspot.com",
  messagingSenderId: "963127805966",
  appId: "1:963127805966:web:cfc9e023d5d9265d79545f",
  measurementId: "G-HYJS8TEJGL",
}

// Initialize Cloud Firestore through Firebase
firebase.initializeApp(firebaseConfig)

var db = firebase.firestore()

var docRef = db.collection("tempo").doc("currentTempo")

var docTempo
var docIsRunning
var metronome

docRef
  .get()
  .then((doc) => {
    if (doc.exists) {
      console.log("Document data:", doc.data())
      docTempo = doc.data().currentTempo
      docIsRunning = doc.data().isRunning
      metronome = new Metronome(docTempo, docIsRunning)

      var tempo = document.getElementById("tempo")
      tempo.textContent = metronome.tempo

      // Unable to initiate sound automatically. Chrome banned it.
      // https://stackoverflow.com/questions/50281568/audiocontext-not-allowed-to-start-in-tonejs-chrome
      // big sadge
      var playPauseIcon = document.getElementById("play-pause-icon")
      playPauseIcon.className = metronome.isRunning ? "play" : "pause"

      var playButton = document.getElementById("play-button")
      playButton.addEventListener("click", function () {
        metronome.startStop()

        if (metronome.isRunning) {
          playPauseIcon.className = "pause"
        } else {
          playPauseIcon.className = "play"
        }
      })

      var tempoChangeButtons = document.getElementsByClassName("tempo-change")
      for (var i = 0; i < tempoChangeButtons.length; i++) {
        tempoChangeButtons[i].addEventListener("click", function () {
          metronome.tempo += parseInt(this.dataset.change)
          tempo.textContent = metronome.tempo
          updateTempo(metronome.tempo)
        })
      }

      var tempoInput = document.getElementById("tempo-input")
      var tempoUpdate = document.getElementById("tempo-input-button")
      tempoUpdate.addEventListener("click", function () {
        metronome.tempo = parseInt(tempoInput.value)
        tempo.textContent = metronome.tempo
        updateTempo(metronome.tempo)
      })
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!")
    }
  })
  .catch((error) => {
    console.log("Error getting document:", error)
  })

function updateTempo(tempo) {
  try {
    db.collection("tempo").doc("currentTempo").update({
      currentTempo: tempo,
    })
  } catch (e) {
    console.error("Error updating document: ", e)
  }
}

db.collection("tempo")
  .doc("currentTempo")
  .onSnapshot(
    {
      // Listen for document metadata changes
      includeMetadataChanges: true,
    },
    (doc) => {
      console.log(doc.data())
      if (metronome.tempo != doc.data().currentTempo) {
        metronome.tempo = doc.data().currentTempo
        tempo.textContent = metronome.tempo
        console.log("updated tempo")
      }
      if (metronome.isRunning != doc.data().isRunning) {
        metronome.isRunning = doc.data().isRunning
        if (metronome.isRunning) {
          playPauseIcon.className = "pause"
          metronome.start()
        } else {
          playPauseIcon.className = "play"
          metronome.stop()
        }
        console.log("updated running")
      }
    }
  )
