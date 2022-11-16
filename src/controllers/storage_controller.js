const storage = require("../storage/storage")
const fs = require('fs')
const debug = console.log.bind(console)

let uploadAvatar = (req, res, next) => {
    const files = req.files
    if (!files) {
        return next()
    }
    res.send(files)
}

let checkinFun = (req, res, next) => {
    const files = req.files
    if(!files) {
        return next()
    }
    res.send(files)
}

let createFolder = storage.createFolder

let streamVideo = (req, res) => {
    const videoPath = `data/lesson_1/video/video.mp4`;
    const videoStat = fs.statSync('data/lesson_1/video/video.mp4')
    const fileSize = videoStat.size;
    const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
        };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
}

module.exports = {
    uploadAvatar: uploadAvatar,
    checkinFun: checkinFun,
    createFolder: createFolder,
    streamVideo: streamVideo,
    upload: storage.upload,
    checkin: storage.checkin
}