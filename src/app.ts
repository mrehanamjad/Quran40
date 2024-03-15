const playlist = document.querySelector("#playlist") as HTMLDivElement;
const playI = document.querySelector("#play-i") as HTMLElement;
let audio: HTMLAudioElement;
let currentIndex: number = 0;
let isplaying:boolean = false;
let translationLangIs: string = localStorage.getItem("Quran40-Tlang") || "";

// Function to display the playlist:
function showPlaylist() {
  for (let i = 0; i < 114; i++) {
    playlist.insertAdjacentHTML(
      "beforeend",
      `<div id="card" class="group w-64 h-72 rounded-lg drop-shadow-xl bg-slate-800 cursor-pointer hover:bg-slate-700">
    <i class="fa-solid fa-circle-play text-teal-700 bg-black rounded-full absolute top-44 opacity-0 group-hover:-translate-y-10 group-hover:opacity-100 transition-transform duration-500 text-5xl right-10"></i>
    <img src="./images/q${Math.floor(
      Math.random() * 14
    )}.jpg" alt="image" class="h-44 w-44 rounded-full m-auto my-4 shadow-lg shadow-black">
    <span class="text-center text-xl text-bold space-y-1 text-white">
      <h2 id="sName">Surah ${quranChaptersEnglish[i]}</h2>
      <h2>${quranChaptersArabic[i]}</h2>
    </span>
  </div> `
    );
  }
}

// // reading translation:---------------------------------------------------------------------------
let readC = document.querySelector("#read-here") as HTMLDivElement;
const searchBtn = document.querySelector("#search-btn") as HTMLButtonElement;
const readNav = document.querySelector("#read-nav-btn") as HTMLButtonElement;
let selectLangs = document.querySelectorAll(
  ".choose"
) as NodeListOf<HTMLSelectElement>;

interface Ayah {
  aya: string;
  arabic_text: string;
  translation: string;
}

interface QuranData {
  result: Ayah[];
}

if (translationLangIs == "") {
  readC.innerHTML = `<span style="font-size:100px;">&#8593;</span><span class="text-4xl underline text-black">Please select a language</span>`;
}

// Function to display translation
function showTranslation(data: QuranData) {
  if (data.result && data.result.length > 0) {
    readC.innerHTML = "";
    for (let i = 0; i < data.result.length; i++) {
      readC.insertAdjacentHTML(
        "beforeend",
        `<p class="text-center">(${data.result[i].aya})</p>
        <p class="text-end text-blue-800 font-medium font-arabic text-2xl md:text-4xl leading-10">${data.result[i].arabic_text}</p>
        <p class="font-urdu leading-10">${data.result[i].translation}</p>`
      );
    }
  }
}

//// Function to fetch translation from API
async function translationApi(i: number, lang: string): Promise<void> {
  if (lang) {
    try {
      const response = await fetch(
        `https://quranenc.com/api/v1/translation/sura/${lang}/${i + 1}`
      );
      const data: QuranData = await response.json();
      showTranslation(data);
    } catch (error) {
      console.error(error);
    }
  }
}

// select translation language ----------
function chooseLang(): void {
  selectLangs.forEach((selectLang: HTMLSelectElement) => {
    for (let i = 0; i < translationLanguages.length; i++) {
      selectLang.insertAdjacentHTML(
        "beforeend",
        `<option value="${translationLanguages[i]}">${translationLanguages[i]}</option>`
      );
    }
    selectLang.addEventListener("change", () => {
      translationLangIs = selectLang.value;
      localStorage.setItem("Quran40-Tlang", translationLangIs);
      translationApi(currentIndex, translationLangIs);
    });
  });
}

// Function to load audio track
function loadTrack() {
  audio.pause();
  audio = new Audio(api(currentIndex));
  audio.play();
  isplaying = true;
  audioRange(audio);
  setTitle(currentIndex);
  translationApi(currentIndex, translationLangIs);
}

translationApi(currentIndex, translationLangIs);

//playing audio when click on card:
function playCard() {
  let cards = document.querySelectorAll("#card") as NodeListOf<HTMLDivElement>;
  Array.from(cards).forEach((card: Element, i: number) => {
    card.addEventListener("click", () => {
      audio.play();
      // changing play-pause icon:
      playI.classList.add("fa-circle-pause");
      playI.classList.remove("fa-circle-play");
      isplaying = true;
      currentIndex = i;
      loadTrack();
    });
  });
}

// fetching audio link
function api(x: number): string {
  if (x < 10) {
    return `https://server8.mp3quran.net/afs/00${x + 1}.mp3`;
  } else if (x > 10 && x < 100) {
    return `https://server8.mp3quran.net/afs/0${x + 1}.mp3`;
  } else {
    return `https://server8.mp3quran.net/afs/${x + 1}.mp3`;
  }
}

function setTitle(i: number) {
  let title = document.querySelector("#title") as HTMLHeadingElement;
  title.textContent = `Surah ${quranChaptersEnglish[i]} ${quranChaptersArabic[i]}`;
}

audio = new Audio(api(currentIndex));

function playPause() {
  playI.addEventListener("click", () => {
    if (isplaying) {
      audio.pause();
      playI.classList.add("fa-circle-play");
      playI.classList.remove("fa-circle-pause");
      playI.title = "Play";
      isplaying = false;
    } else {
      audio.play();
      playI.classList.add("fa-circle-pause");
      playI.classList.remove("fa-circle-play");
      playI.title = "Pause";
      isplaying = true;
    }
  });
}

function next() {
  if (currentIndex < 113) {
    currentIndex++;
    loadTrack();
  } else {
    currentIndex = 0;
    loadTrack();
  }
}

function previous() {
  if (currentIndex > 0) {
    currentIndex--;
    loadTrack();
  } else {
    currentIndex = 113;
    loadTrack();
  }
}

const previousI = document.querySelector("#previous-i") as HTMLElement;
previousI.addEventListener("click", previous);
const nextI = document.querySelector("#next-i") as HTMLElement;
nextI.addEventListener("click", next);

// for volume controls...............................................
let isVolumeX = false;
let volI = document.querySelector("#volume-i") as HTMLInputElement;
// function to change volume icon on increasing and decreasing the volume
function toggleVolumeIcon(volRange: HTMLInputElement) {
  let volRangeVal: number = parseInt(volRange.value);
  volI.className = "";
  if (volRangeVal === 0) {
    volI.className = "fa-solid fa-volume-xmark";
    isVolumeX = true;
  } else if (volRangeVal > 0 && volRangeVal < 30) {
    volI.className = "fa-solid fa-volume-off";
    isVolumeX = false;
  } else if (volRangeVal >= 30 && volRangeVal <= 60) {
    volI.className = "fa-solid fa-volume-low";
    isVolumeX = false;
  } else {
    volI.className = "fa-solid fa-volume-high";
    isVolumeX = false;
  }
}
// function to on and off volume on volume button click
function clickVolumeIcon(volRange: HTMLInputElement) {
  volI.addEventListener("click", () => {
    if (isVolumeX === true) {
      volRange.value = "50";
      audio.volume = Number(volRange.value) / 100;
      toggleVolumeIcon(volRange);
      console.log(isVolumeX);
    } else {
      volRange.value = "0";
      audio.volume = Number(volRange.value) / 100;
      toggleVolumeIcon(volRange);
    }
  });
}

// volume bar
function volumeRange(audio: HTMLAudioElement) {
  const volRange = document.querySelector("#volume-range") as HTMLInputElement;
  volRange.addEventListener("input", () => {
    audio.volume = Number(volRange.value) / 100;
    toggleVolumeIcon(volRange);
  });
  clickVolumeIcon(volRange);
}

function timeStamp(audio: HTMLAudioElement) {
  let tStamp = document.querySelector("#timestamp") as HTMLSpanElement;
  //format the time:
  let currentTimeSeconds = Math.round(audio.currentTime % 60);
  let currentTimeMinutes = Math.round((audio.currentTime % 3600) / 60);
  let currentTimeHours = Math.round(audio.currentTime / 3600);
  let durationSeconds = Math.round(audio.duration % 60);
  let durationMinutes = Math.round((audio.duration % 3600) / 60);
  let durationHours = Math.round(audio.duration / 3600);
  //set the time display:
  if (currentTimeHours == 0 && durationHours == 0) {
    tStamp.textContent = `${currentTimeMinutes}:${currentTimeSeconds} / ${durationMinutes}:${durationSeconds}`;
  } else if (currentTimeHours == 0) {
    tStamp.textContent = `${currentTimeMinutes}:${currentTimeSeconds} / ${durationHours}:${durationMinutes}:${durationSeconds}`;
  } else if (durationHours == 0) {
    tStamp.textContent = `${currentTimeHours}:${currentTimeMinutes}:${currentTimeSeconds} / ${durationMinutes}:${durationSeconds}`;
  } else {
    tStamp.textContent = `${currentTimeHours}:${currentTimeMinutes}:${currentTimeSeconds} / ${durationHours}:${durationMinutes}:${durationSeconds}`;
  }
}

//audio progress bar
function audioRange(audio: HTMLAudioElement) {
  const audRange = document.querySelector("#audio-renge") as HTMLInputElement;
  audio.addEventListener("timeupdate", () => {
    audRange.value = ((audio.currentTime / audio.duration) * 100).toString();
    timeStamp(audio);
    //autoplay next:
    audio.currentTime == audio.duration ? next() : null;
  });
  audRange.addEventListener("input", () => {
    audio.currentTime = (parseInt(audRange.value) / 100) * audio.duration;
  });
}

const readNavBtn = document.querySelector("#read-nav-btn") as HTMLButtonElement;
let TformS = document.querySelector("#tranlation-form-s") as HTMLDivElement;
const searchBarR = document.querySelector(
  "#search-bar-responsive"
) as HTMLDivElement;

function showReadNav() {
  TformS.classList.toggle("hidden");
  TformS.classList.toggle("flex");
}

function closeReadNav() {
  TformS.classList.remove("flex");
  TformS.classList.add("hidden");
}

function readmode() {
  let isReadModeOn = false;
  let playBar = document.querySelector("#play-bar") as HTMLDivElement;
  let ReadBtn = document.querySelector("#read-btn") as HTMLButtonElement;
  let searchBar = document.querySelector("#search-bar") as HTMLDivElement;
  let TformL = document.querySelector("#tranlation-form-l") as HTMLDivElement;
  ReadBtn.addEventListener("click", () => {
    playlist.classList.toggle("hidden");
    playBar.classList.toggle("hidden");
    readC.classList.toggle("hidden");
    searchBar.classList.toggle("md:hidden");
    searchBtn.classList.toggle("hidden");
    TformL.classList.toggle("md:hidden");
    TformL.classList.toggle("md:block");
    readNav.classList.toggle("hidden");
    searchBarR.classList.add("hidden");
    if (isReadModeOn) {
      closeReadNav();
      ReadBtn.textContent = "Read";
      isReadModeOn = false;
    } else {
      ReadBtn.textContent = "Unread";
      isReadModeOn = true;
      translationLangIs == "" ? showReadNav() : null;
    }
  });
}

readNavBtn.addEventListener("click", () => {
  showReadNav();
});

const closeI = document.querySelector("#close") as HTMLElement;
closeI.addEventListener("click", () => {
  closeReadNav();
});

// // Search Functionality ---------------------------------------------------------
//Responsive search bar for small divices
function showSearchBar() {
  searchBtn.addEventListener("click", () => {
    searchBarR.classList.toggle("hidden");
  });
}
//Search function
function searchFunc() {
  const searchInputs = document.querySelectorAll(
    ".search-input"
  ) as NodeListOf<HTMLInputElement>;
  searchInputs.forEach((searchInput: HTMLInputElement) => {
    searchInput.addEventListener("keyup", () => {
      let sNames = document.querySelectorAll(
        "#sName"
      ) as NodeListOf<HTMLButtonElement>;
      sNames.forEach((sName: HTMLButtonElement) => {
        if (sName.textContent && sName.parentElement?.parentElement)
          if (
            sName.textContent
              .toLowerCase()
              .indexOf(searchInput.value.toLowerCase()) > -1
          ) {
            sName.parentElement.parentElement.classList.remove("hidden");
          } else {
            sName.parentElement.parentElement.classList.add("hidden");
          }
      });
    });
  });
}

playPause();
volumeRange(audio);
audioRange(audio);
setTitle(currentIndex);
showPlaylist();
playCard();
readmode();
chooseLang();
showSearchBar();
searchFunc();
