import { play_song, start } from "./song.js";
import { current } from "./song.js";

const fs = window.require('fs');
const os = require('os');
const path = window.require('path');

let validExt = [".mp3", ".wav", ".m4a", ".mp4", ".flac", ".wma", ".aac"]
let songList = {};
let library = document.getElementById('musiclist');
let songsPath = path.join(os.homedir(), 'Music');

let songChecker = new Audio();

function getSongs(directory) {
    fs.readdir(directory, (error, fileNames) => {
        fileNames.forEach(filename => {
            const file = path.parse(filename);
            if(!validExt.includes(file.ext)) {
                return;
            }
            // const filepath = path.resolve(directory, filename);
            songChecker.src = path.join(songsPath, file.base);
            if(songChecker.canPlayType('audio/mpeg' == '')) {
                console.log("error has occured");
                deleteSong()
            }
            
            let songContainer = createSongDiv(file);

            library.appendChild(songContainer);
        })
    })
}

function createSongDiv(fileName) {
    //the outer most wrapper
    let songContainer = document.createElement("div");
    songContainer.className = "song-container";

    //the button
    let playButton = document.createElement("div");
    playButton.className = "song-play-button centered";
    let button = document.createElement("button");
    button.className = "play-button-image";
    button.id = "song" + Object.keys(songList).length;
    button.addEventListener('click', () => {
        start();
        play_song(fileName);
    })
    playButton.appendChild(button);

    songList[button.id] = fileName;

    //the name of the song
    let songName = document.createElement("div");
    songName.className = "song-name centered left text-overflow";
    let name = document.createTextNode(fileName.name);
    songName.appendChild(name);

    //length of the song
    let songLength = document.createElement("div");
    songLength.className = "song-length centered";

    let deleteButton = document.createElement("div");
    deleteButton.className = "delete-length centered"

    let deleteButtonImage = document.createElement("button");
    deleteButtonImage.className = "delete-button-image"
    deleteButtonImage.addEventListener('click', () => {
        deleteSong(path.join(songsPath, fileName.base));
    })

    deleteButton.appendChild(deleteButtonImage);

    songContainer.appendChild(playButton);
    songContainer.appendChild(songName);
    songContainer.appendChild(songLength);
    songContainer.appendChild(deleteButton);

    return songContainer;
}

export function updateLibrary() {
    library.innerHTML = "";
    getSongs(songsPath);
}

export function getPath() {
    return songsPath;
}

function deleteSong(song) {
    if(song == (songsPath + "\\" + current())) {
        console.log("Can't delete song that is playing");
        return;
    }
    fs.unlink(song, (err) => {
        if(err) {
            console.log(err);
            return;
        }
        updateLibrary();
    })
}

updateLibrary();