function isMobile() {
  try { document.createEvent("TouchEvent"); return true; }
  catch(e) { return false; }
}

if (isMobile()) {
  document.getElementsByTagName("html")[0].style.transform = "rotate(90deg)";
  let temp = document.getElementsByTagName("body")[0].style.width;
  document.getElementsByTagName("body")[0].style.width = document.getElementsByTagName("body")[0].style.height;
  document.getElementsByTagName("body")[0].style.height = temp;
}

const firebaseConfig = {
  apiKey: "AIzaSyCHnHJKWv-eA-dr4rR4q_mj5rFq0ACn_U8",
  databaseURL: "https://psbh45-6ca43.firebaseio.com",
  projectId: "psbh45-6ca43",
  storageBucket: "psbh45-6ca43.appspot.com",
  messagingSenderId: "1050270713312",
  appId: "1:1050270713312:web:a84906a08269f15210d785",
  measurementId: "G-FM1CVEXZGP"
};

firebase.initializeApp(firebaseConfig);
let database = firebase.database();
database.ref("/").remove();

const keys = document.querySelectorAll(['.piano .white', '.piano .black']);
console.log(keys)

keys.forEach(key => {
  if (isMobile()) {
    key.addEventListener('touchstart', () => {
      let phoneme = document.querySelectorAll(`div[data-note="${key.getAttribute("data-note")}"]`)[0];
      database.ref("/").push(key.getAttribute("data-note"));
      phoneme.classList.add("bg-gray");
      setTimeout(() => {
        phoneme.classList.remove("bg-gray");
      }, 150)
    })
  } else {
    key.addEventListener('click', () => {
      console.log("123")
      let phoneme = document.querySelectorAll(`div[data-note="${key.getAttribute("data-note")}"]`)[0];
      database.ref("/").push(key.getAttribute("data-note"));
      phoneme.classList.add("bg-gray");
      setTimeout(() => {
        phoneme.classList.remove("bg-gray");
      }, 150)
    })
  }
})