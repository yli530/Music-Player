import { getPath } from "./library.js";
const p = window.require('path');

let isPlaying = false;
let loop;
let audioPlayer = document.getElementById("audioplayer");
let songName = document.getElementById("songName");
let songTimer = document.getElementById("songTimer");
let prog_bar_fill = document.getElementById("prog-bar-fill");
let pauseButton = document.getElementById("pauseButton");
let volumeSlider = document.getElementById("volume");

let current_time = 0, play_time, tick_rate = 100;
let currentSong;

audioPlayer.volume = volumeSlider.value / 100;

export function play_song(path) {
    clearInterval(loop);
    currentSong = path.base;
    audioPlayer.src = p.join(getPath(), path.base);
    audioPlayer.load();
}

export function current() {
    return currentSong;
}

function frame() {
    if(!isPlaying) return;
    if(current_time >= play_time) {
        changeState();
        prog_bar_fill.style.width = "100%";
        clearInterval(loop);
    } else {
        prog_bar_fill.style.width = ((current_time / play_time) * 100) + "%";
        songTimer.innerHTML = timeFormat(current_time) + " / " + timeFormat(play_time);
    }
}

function changeState() {
    if(currentSong == null) return;
    if(isPlaying) {
        pauseButton.style.backgroundImage = "url(./icons/play.png)";
        audioPlayer.pause();
    } else {
        pauseButton.style.backgroundImage = "url(./icons/pause.png)";
        audioPlayer.play();
    }
    isPlaying = !isPlaying;
}

export function start() {
    pauseButton.style.backgroundImage = "url(./icons/pause.png)";
    isPlaying = true;
}

pauseButton.addEventListener('click', () => {
    changeState();
})

audioPlayer.onloadedmetadata = function() {
    play_time = audioPlayer.duration * 1000;
}

audioPlayer.oncanplaythrough = function() {
    audioPlayer.play();

    prog_bar_fill.style.fill = "0%";
    current_time = 0;
    songName.innerHTML = currentSong;
    songTimer.innerHTML = timeFormat(current_time) + " / " + timeFormat(play_time);

    loop = setInterval(frame, tick_rate);
}

audioPlayer.onended = function() {
    songTimer.innerHTML = timeFormat(current_time) + " / " + timeFormat(play_time);
    clearInterval(loop);
}

audioPlayer.ontimeupdate = function() {
    current_time = audioPlayer.currentTime * 1000;
}

volumeSlider.oninput = function() {
    audioPlayer.volume = volumeSlider.value / 100;
}

window.onkeydown = function(event) {
    if(event.keyCode == 32) {
        event.preventDefault();
        changeState();
    }
}

function timeFormat(ms) {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return `${minutes}m:${seconds}s`
}