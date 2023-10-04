const wrapper = document.querySelector(".wrapper"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
mainAudio = wrapper.querySelector("#main-audio"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = progressArea.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list")

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
isMusicPaused = true;

window.addEventListener("load", ()=>{
  loadMusic(musicIndex);
});

function loadMusic(indexNumb){
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

//play music
function playMusic(){
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

//pause music
function pauseMusic(){
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

//prev music
function prevMusic(){
  musicIndex--; //уменьшение индекса

  musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
}

//next music
function nextMusic(){
  musicIndex++; //увеличение индекса musicIndex на 1

  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
}

// play & pause button
playPauseBtn.addEventListener("click", ()=>{
  const isMusicPlay = wrapper.classList.contains("paused");
  //если isPlayMusic true, то  pauseMusic, иначе  PlayMusic
  isMusicPlay ? pauseMusic() : playMusic();
});

//  Событие кнопки prev music
prevBtn.addEventListener("click", ()=>{
  prevMusic();
});

// next music
nextBtn.addEventListener("click", ()=>{
  nextMusic();
});

// обновление прогресс бара в соответствии с текущим временем музыки
mainAudio.addEventListener("timeupdate", (e)=>{
  const currentTime = e.target.currentTime; //начало воспроизведения песни в настоящее время
  const duration = e.target.duration; //начало воспроизведения песни общая продолжительность
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current-time"),
  musicDuartion = wrapper.querySelector(".max-duration");
  mainAudio.addEventListener("loadeddata", ()=>{
    // обновление общей продолжительности трека
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if(totalSec < 10){
      totalSec = `0${totalSec}`;
    }
    musicDuartion.innerText = `${totalMin}:${totalSec}`;
  });
  // обновление текущего времени
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if(currentSec < 10){
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// обновление текущего времени, воспроизведение песни в соответствии с шириной индикатора выполнения
progressArea.addEventListener("click", (e)=>{
  let progressWidth = progressArea.clientWidth; //индикатор выполнения прогрессбара
  let clickedOffsetX = e.offsetX; //получение смещения x
  let songDuration = mainAudio.duration; //получение продолжительности песни
  
  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic();
});
