const audio = document.getElementById("audio")
const playBtn = document.getElementById("play-button")
const playImg = document.getElementById("play-img")
const progressContainer = document.querySelector(".progress-container");
const progressDot = document.querySelector(".progress-dot");
const currentTimeEle = document.getElementById("current-time");
const durationEle = document.getElementById("duration");

playBtn.addEventListener("click", () => {
    if(audio.paused){
        audio.play(); playImg.src="assets/play-button-2.PNG";
    } else{
        audio.pause(); playImg.src="assets/play-button-1.PNG";
    }
});

audio.addEventListener("timeupdate", () => {
    if (!audio.duration || isNaN(audio.duration)) return;
        const progress = audio.currentTime / audio.duration;
        const containerWidth = progressContainer.clientWidth;
        const dotWidth = progressDot.offsetWidth;
        const maximumMove = containerWidth - dotWidth;
        const dotX = progress * maximumMove;
        progressDot.style.left = dotX + "px";

        currentTimeEle.textContent = timeFormat(audio.currentTime);
});

audio.addEventListener("ended", () => {
    if (isRepeat){
        audio.currentTime = 0;
        audio.play();
        return;
    }

    if (isShuffle){
        let next;
        do{
            next = Math.floor(Math.random() * songs.length);
        } while (next === currentSong);
        currentSong = next;

    } 
    
    else {
        currentSong = (currentSong + 1) % songs.length;
    }
    loadSong(currentSong);
    audio.play();
    playImg.src = "assets/play-button-2.PNG"
});

progressContainer.addEventListener("click", (e) => {   
    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = progressContainer.clientWidth;
    
    const percent = clickX / width;
    audio.currentTime = percent * audio.duration;

})

const songs = [
    {
    title: "Rehhab",
    artist: "OsamaSon",
    src: "audio/rehhab.mp3",
    cover: "song-covers/flex-musix.png"
    },
    {
    title: "vvs valentine",
    artist: "Destroy Lonely",
    src: "audio/vvs-valentine.mp3",
    cover: "song-covers/darkhorse.png"
    },
    {
    title: "sol",
    artist: "Che",
    src: "audio/sol.mp3",
    cover: "song-covers/closed-caption.png"
    },
    {
    title: "White Meadow",
    artist: "Bladee, Ecco2k",
    src: "audio/white-meadow.mp3",
    cover: "song-covers/crest.png"
    },
    {
    title: "REGRET",
    artist: "bunii",
    src: "audio/regret.mp3",
    cover: "song-covers/six.png"
    },
    {
    title: "Summer Sixteen",
    artist: "OsamaSon",
    src: "audio/summer-sixteen.mp3",
    cover: "song-covers/osamaseason.png"
    }
]
let currentSong = 0
function loadSong(index){
    audio.src = songs[index].src;
    document.getElementById("song-name").textContent = songs[index].title;
    document.getElementById("artist-name").textContent = songs[index].artist;
    document.getElementById("song-cover").src = songs[index].cover;
    playImg.src = "assets/play-button-1.PNG"
    progressDot.style.left = "0px";
    currentTimeEle.textContent = "0:00";
    durationEle.textContent = "0:00";
}

function getNextSongIndex() {
    if (isShuffle) {
        let next;
        do {
            next = Math.floor(Math.random() * songs.length);
        } while (next === currentSong);
        return next;
    }
    return (currentSong + 1) % songs.length;
}

loadSong(currentSong)
document.getElementById("next-button").addEventListener("click", () => {
    currentSong = getNextSongIndex();
    loadSong(currentSong);
    audio.play()
    playImg.src = "assets/play-button-2.PNG"
});

document.getElementById("prev-button").addEventListener("click", () => {
    currentSong = (currentSong -1 + songs.length) % songs.length;
    loadSong(currentSong);
    audio.play()
    playImg.src = "assets/play-button-2.PNG"
});

const closeBtn = document.getElementById("close-button");
closeBtn.addEventListener("click", () => {
    window.electronAPI.closeApp();
});

const minimizeBtn = document.getElementById("minimize-button");
minimizeBtn.addEventListener("click", () => {
    window.electronAPI.minimizeApp();
});

function timeFormat(seconds){
    const mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    if (secs < 10) {
        secs = "0" + secs
    }
    return mins + ":" + secs;
};

audio.addEventListener("loadedmetadata", () => {
    durationEle.textContent = timeFormat(audio.duration);
});

let isShuffle = false;
let isRepeat = false;
const shuffleBtn = document.getElementById("shuffle-button");
const repeatBtn = document.getElementById("repeat-button");
shuffleBtn.addEventListener("click", () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle("active", isShuffle);
    shuffleBtn.querySelector("img").src = isShuffle ? "assets/shuffle-on.PNG" : "assets/shuffle-off.PNG";
});

repeatBtn.addEventListener("click", () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle("active", isRepeat);
    repeatBtn.querySelector("img").src = isRepeat ? "assets/repeat-on.PNG" : "assets/repeat-off.PNG";
});

const muteBtn = document.getElementById("volume-button");
const muteImg = document.getElementById("mute-img");
let isMuted = false;
muteBtn.addEventListener("click", () => {
    isMuted = !isMuted;
    audio.muted = isMuted;
    muteImg.src = isMuted
    ? "assets/volume-on.png":
    "assets/volume-off.png"
});

const rotateBtn = document.getElementById("rotate-button");
const rotateImg = document.getElementById("rotate-img");
const mainBox = document.querySelector(".main-box");

let isHorizontal = false;

rotateBtn.addEventListener("click", () => {
    isHorizontal = !isHorizontal
    mainBox.classList.toggle("horizontal", isHorizontal);
    rotateImg.src = isHorizontal
    ? "assets/default-layout.PNG":
    "assets/switch-layout.PNG"

    const verticalSize = {width: 200, height: 320}
    const horizontalSize = {width: 365, height: 222}
    const size = isHorizontal ? horizontalSize : verticalSize
    window.electronAPI.resizeWindow(size.width, size.height)
});


