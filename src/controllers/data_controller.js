const debug = console.log.bind(console)
const data = require('../storage/data')
const msql = require('../database/mysql')

let getLessons = async (req, res) => {
    var id = req.jwtDecoded.data.id
    try {
        let lessons = await data.getLessons()
        await msql.updateLesson(id, lessons.length)
        let user = await msql.getUser(id)
        return res.status(200).json({
            totalLesson: lessons.length,
            currentLesson: user.current_lesson,
            lessons: lessons
        })
    } catch (error) {
        debug(error)
    }
}

let getTest = async (req, res) => {
    let outcome = await data.getTest(req.query.lesson)
    if(outcome) {
        res.status(200).json(outcome)
    }
}

let getQuestion = async (req, res) => {
    let outcome = await data.getQuestion(req.query.lesson)
    if(outcome == 'invalid-file') {

    } else {
        return res.status(200).json(outcome)
    }
} 
 
let getResult = async (req, res) => {
    var result = await data.getResult(req.query.id, req.query.lesson)
    res.status(200).json({result : result})
}

let submitTest = async (req, res) => {
    var id = req.jwtDecoded.data.id
    await data.submitTest(id, req.body.result, req.body.lesson, req.body.test).then((value) => {
        res.status(200).json({message : value})
    })
}

let getTestInfor = async (req, res) => {
    await data.getTestInfor(req.jwtDecoded.data.id, req.query.lesson).then((value) => {
        res.status(200).json(JSON.parse(value))
    })
}

let getDocument = async(req, res) => {
    await data.getDocument(req.body.lesson).then((value) => {
        res.status(200).json({data : value})
    })
}


module.exports = {
    getQuestion: getQuestion,
    getResult: getResult,
    getLessons: getLessons,
    getTest: getTest,
    submitTest: submitTest,
    getTestInfor: getTestInfor,
    getDocument: getDocument
}