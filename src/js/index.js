// define some variable
let volume = 1;
let exceeding = 0;
let animationCount = 0;
let database, frequency, freqArray, color, weakenAnimation;
const radius = 250;
const colorsValue = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#8B00FF"];
const phonemeFrequencies = {
  "C": { frequency: 262, index: 0 },
  "Db": { frequency: 277, index: 1 },
  "D": { frequency: 294, index: 2 },
  "Eb": { frequency: 311, index: 3 },
  "E": { frequency: 330, index: 4 },
  "F": { frequency: 349, index: 5 },
  "Gb": { frequency: 370, index: 6 },
  "G": { frequency: 392, index: 7 },
  "Ab": { frequency: 415, index: 8 },
  "A": { frequency: 440, index: 9 },
  "Bb": { frequency: 466, index: 10 },
  "B": { frequency: 494, index: 11 }
};

const firebaseConfig = {
  apiKey: "AIzaSyCHnHJKWv-eA-dr4rR4q_mj5rFq0ACn_U8",
  databaseURL: "https://psbh45-6ca43.firebaseio.com",
  projectId: "psbh45-6ca43",
  storageBucket: "psbh45-6ca43.appspot.com",
  messagingSenderId: "1050270713312",
  appId: "1:1050270713312:web:a84906a08269f15210d785",
  measurementId: "G-FM1CVEXZGP"
};

// MusicBox is the class in music.js
let music = new MusicBox({
  type: 'square',  // type: sine | square | triangle | sawtooth
  duration: 1
});

// click listener
document.getElementById("button").onclick = () => {
  let canvas = document.getElementById("canvas");
  let context = canvas.getContext("2d");

  // the position of canvas 
  context.canvas.height = window.innerHeight;
  context.canvas.width = window.innerWidth;

  drawCircle(context);

  // connect to Firebase
  firebase.initializeApp(firebaseConfig);
  database = firebase.database();
  database.ref("/").remove();

  // firebase listener
  database.ref("/").limitToLast(1).on("value", value => {
    if (value.val() != null) {
      let phoneme = value.val()[Object.keys(value.val())[0]];
      
      volume = (Math.floor(Math.random() * 20) + 1) / 100 + 0.8
      
      // make a sound
      music.createSound(phonemeFrequencies[phoneme].frequency);
      
      if (document.getElementById("phoneme") != null) {
        document.getElementById("phoneme").remove();
      }
      
      // display
      displayPhonemeName(phoneme);
      frequency = phonemeFrequencies[phoneme].index;
      
      // circle animation
      document.getElementById("canvas").classList.add("set-animate-1");
      document.getElementById("canvas").style.transform = "scale(0.93)"
      setTimeout(() => {
        document.getElementById("canvas").style.transform = "scale(1.08)";
        setTimeout(() => {
          document.getElementById("canvas").style.transform = "scale(1)";
        }, 130)
      }, 130)
      
      animate();
    }
  });

  // let check connecting button be disabled.
  document.getElementById("button").style.display = "none";
  document.getElementsByTagName("canvas")[0].style.display = "block";
};

function animate(){
  let canvas = document.getElementById("canvas");
  let context = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  drawCircle(context);

  // bar setting
  const bars = 49;
  const theta = 2 * Math.PI / bars;
  frequency = parseInt((frequency + 1) * 4 - 1);
  freqArray = Array(48).fill(0);
  freqArray[frequency] = 100;

  for (let i = 1; i < 6; i++) {
    if (frequency - i < 0) {
      freqArray[bars - exceeding] = Math.floor(Math.random() * 100);
      freqArray[frequency + i] = Math.floor(Math.random() * 100);
      exceeding = exceeding + 1;
    } else if (frequency + i > bars) {
      freqArray[frequency - i] = Math.floor(Math.random() * 100);
      freqArray[exceeding] = Math.floor(Math.random() * 100);
      exceeding = exceeding + 1;
    } else {
      freqArray[frequency - i] = Math.floor(Math.random() * 100);
      freqArray[frequency + i] = Math.floor(Math.random() * 100);
    }
  }
  
  exceeding = 0;
  color = colorsValue[Math.floor(Math.random() * 7)];

  // drawBar
  for (let i = 0; i < bars; ++i) {
    let barHeight = freqArray[i] * 3;

    let startX = canvas.width / 2 + radius * Math.cos(theta * i);
    let startY = canvas.height / 2 + radius * Math.sin(theta * i);

    let endX = canvas.width / 2 + (radius + barHeight) * Math.cos(theta * i);
    let endY = canvas.height / 2 + (radius + barHeight) * Math.sin(theta * i);

    drawBar(startX, startY, endX, endY, context);
  }

  // animation
  animationCount = 0;
  setTimeout(() => {
    let element = document.createElement("div");
    element.id = Date.now().toString();
    element.classList.add("default-circle", "centered");

    document.getElementsByTagName("body")[0].appendChild(element);

    document.getElementById(element.id).style.display = "block";
    document.getElementById(element.id).classList.add("set-animate-2");
    setTimeout(() => {
      document.getElementById(element.id).style.height = "490px";
      document.getElementById(element.id).style.width = "490px";
      setTimeout(() => {
        document.getElementById(element.id).remove();
      }, 270)
    }, 20)
  }, 10);

  continuousWeakenFreqArray();
}

function continuousWeakenFreqArray() {
  weakenFreqArray();
  clearInterval(weakenAnimation);
  
  if (animationCount < 20) {
    weakenAnimation = setInterval(continuousWeakenFreqArray, 20);
    animationCount += 1;
  } else {
    animationCount = 0;
  }
}

function weakenFreqArray() {
  let canvas = document.getElementById("canvas");
  let context = canvas.getContext("2d");

  context.canvas.width = window.innerWidth;
  context.canvas.height = window.innerHeight;

  drawCircle(context);

  const bars = 49;
  const theta = 2 * Math.PI / bars;  
  
  freqArray.forEach((value, index, array) => {
    if (value - 5 < 0) {
      array[index] = 0;
    } else {
      array[index] = value - 5;
    }
  })
    
  for (let i = 0; i < bars; ++i) {
    let barHeight = freqArray[i] * 3;

    let startX = canvas.width / 2 + radius * Math.cos(theta * i);
    let startY = canvas.width / 2 + radius * Math.sin(theta * i);
    let endX = canvas.width / 2 + (radius + barHeight) * Math.cos(theta * i);
    let endY = canvas.width / 2 + (radius + barHeight) * Math.sin(theta * i);

    drawBar(startX, startY, endX, endY, context, color);
  }
}

function drawBar(startX, startY, endX, endY, canvasContext){
  const barWidth = 12;

  canvasContext.strokeStyle = color;
  canvasContext.lineWidth = barWidth;
  canvasContext.beginPath();
  canvasContext.moveTo(startX, startY);
  canvasContext.lineTo(endX, endY);
  canvasContext.stroke();
}

function drawCircle(context) {
  let x = canvas.width / 2;
  let y = canvas.height / 2;

  context.shadowBlur = 20;
  context.shadowColor = "black";

  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.strokeStyle = "#FFFFFF";
  context.lineWidth = 10;
  context.stroke();

  context.shadowBlur = 0;
}

function displayPhonemeName(phonemeName) {
  let element = document.createElement("div");
  element.id = "phoneme";
  element.classList.add("centered");
  element.innerHTML = phonemeName;
  document.body.appendChild(element);
}