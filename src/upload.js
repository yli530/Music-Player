const {dialog} = require('@electron/remote');
const os = require('os');
const fs = require('fs');
const path = require('path');

import { updateLibrary, getPath } from './library.js';

let uploadButton = document.getElementById('upload-button');

uploadButton.addEventListener('click', () => {
    dialog.showOpenDialog({
        defaultPath: path.join(os.homedir(), 'Downloads'),
        title: 'a',
        filters: [{name: 'Songs', extensions: ['mp3', 'wav', 'm4a', 'flac', 'wma', 'aac']}],
        buttonLabel: "Select"
    }).then((result) => {
        if(result.canceled) return;
        saveFile(result.filePaths[0]);
    })
})

function saveFile(song) {
    fs.readFile(song, (err, audioData) => {
        if(err) {
            console.log(err);
        } else {
            const filename = song.split("\\").pop();
            const writeTo = path.join(getPath(), filename);
            fs.writeFile(writeTo, audioData, (error) => {
                if(error) {
                    console.log(error);
                }
                updateLibrary();
            })
        }
    })
}