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

var metronome = new Metronome()
var tempo = document.getElementById("tempo")
tempo.textContent = metronome.tempo

var playPauseIcon = document.getElementById("play-pause-icon")

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

function updateTempo(tempo) {
  try {
    db.collection("tempo").doc("currentTempo").update({
      currentTempo: tempo,
    })
  } catch (e) {
    console.error("Error updating document: ", e)
  }
}
