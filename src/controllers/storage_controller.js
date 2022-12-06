const storage = require("../storage/storage")
const fs = require('fs')
const { promisify } = require("util")
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

let streamVideo = async (req, res) => {
    filename = 'data/lesson_1/video/video.mp4'
    fileInfo = promisify(fs.stat)
    const {size} = await fileInfo(filename); 
    const range = req.headers.range;
    if(range){
        let [start, end] = range.replace(/bytes=/, '').split('-');
        start = parseInt(start, 10);
        end = end ? parseInt(end, 10) : size-1;

        res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': (start-end) + 1,
        'Content-Type': 'video/mp4'
        })

        fs.createReadStream(filename, {start, end}).pipe(res);
    }else{
        res.writeHead(200, {
        'Content-Length': size,
        'Content-Type': 'video/mp4'
        });  
        fs.createReadStream(filename).pipe(res);
  }
}

module.exports = {
    uploadAvatar: uploadAvatar,
    checkinFun: checkinFun,
    createFolder: createFolder,
    streamVideo: streamVideo,
    upload: storage.upload,
    checkin: storage.checkin
}