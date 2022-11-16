const multer = require('multer')
const fs = require('fs')
const debug = console.log.bind(console);

const storageAvatar = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'users')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})

const storageCheckin = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'checkin')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})



const upload = multer({storage: storageAvatar, preservePath: true})
const checkin = multer({storage: storageCheckin, preservePath: true})

let createFolder = (path) => {
    try {
        if (!fs.existsSync(path)){
            fs.mkdirSync(path)
        } 
    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    createFolder: createFolder,
    upload: upload,
    checkin: checkin
}