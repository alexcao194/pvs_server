const debug = console.log.bind(console)
const fs = require('fs')
const { resolve } = require('path')
const storage = require('../storage/storage')

let submitQuestion = (id, que, ans, lesson) => {
    storage.createFolder(`data/${lesson}/quiz/${id}`)
    return new Promise((resolve, reject) => {
        if(que == 0) {
            fs.writeFileSync(`data/${lesson}/quiz/${id}/${id}.cvd`, '')
        }
        ANSWER = ['A', 'B', 'C', 'D']
        var res = 'wrong'
        var tmp = fs.readFileSync(`data/${lesson}/quiz/solve.txt`, 'utf-8').split('\n')
        if(tmp[que] == ANSWER[ans]) res = 'accept'
        fs.appendFileSync(`data/${lesson}/quiz/${id}/${id}.cvd`, `${ANSWER[ans]}\n`)
        if(que == 19) {
            var cnt = 0
            var a = fs.readFileSync(`data/${lesson}/quiz/${id}/${id}.cvd`, 'utf-8').split('\n')
            var js = {}
            js['name'] = 'text_question1'
            js['answer'] = {}
            if(tmp[tmp.length - 1].length == 0) tmp.pop()
            if(a[a.length - 1].length == 0) a.pop()
            for(let i = 0; i < a.length; i++) {
                js['answer'][`question-${i + 1}`] = a[i]
                if(tmp[i] == a[i]) {
                    cnt++
                    js['answer'][`question-${i + 1}`] += '-correct'
                } else js['answer'][`question-${i + 1}`] += '-wrong'
            }
            js['result'] = `${cnt}/${a.length}`
            fs.writeFileSync(`data/${lesson}/quiz/${id}/${id}.json`, JSON.stringify(js))
            fs.appendFileSync(`data/${lesson}/quiz/${id}/${id}.cvd`, `${cnt}/${a.length}`)
        }
        resolve(res)
    })
}

let submitTest = (id, result, lesson, test) => {
    return new Promise((resolve, reject) => {
        storage.createFolder(`data/${lesson}/test/${id}`)
        var js = {}
        for(let i = 0; i < result.length; i++) {
            js[`bank_${i + 1}`] = result[i]
        }
        fs.writeFileSync(`data/${lesson}/test/${id}/test_${test}.json`, JSON.stringify(js))
        resolve('done')
    })
}

let getResult = (id, lesson) => {
    return new Promise((resolve, reject) => {
        fs.readFile(`data/${lesson}/quiz/${id}/${id}.cvd`, 'utf-8', function(err, data) {
            if(err) resolve('nope')
            else {
                a = data.split('\n')
                if(a[a.length - 1] == '') a.pop()
                if(a[a.length - 1].length != 1) {
                    resolve(a[a.length - 1])
                } else {
                    resolve(a.length)
                }
            }
        })
    })
}

let getTest = (lesson) => {
    return new Promise((resolve, reject) => {
        var data = fs.readFileSync(`data/${lesson}/test/test.txt`, 'utf-8').split('<end/>')
        test = []
        for(let i = 0; i < data.length; i++) {
            var outcome = {}
            var t = data[i].split('\n')
            for(let i = 0; i < t.length; i++) {
                outcome[`sentence_${i + 1}`] = t[i].replace(`\r`, '').split('<blank/>')
            }
            test.push(outcome)
        }
        resolve(test)
    })
}

let getQuestion = (lesson) => {
    return new Promise((resolve, rejects) => {
        fs.readFile(`data/${lesson}/quiz/quiz.txt`, function(error, data) {
            if(error) {
                return resolve('invalid-file')
            }
            tmp = data.toString().split('\n') 
            qtSend = {}
            qtsSend = {}
            q = {}
            solve = ''
            ANSWER = ['A', 'B', 'C', 'D']
            for(let i = 0; i < tmp.length; i++) {
                if(i % 5 == 0) {
                    qtSend['question'] = tmp[i].replace('\r', '').replace('\\C', '')
                } else {
                    qtSend[`answer-${i % 5}`] = tmp[i].replace('\r', '').replace('\\C', '')
                }
                if(tmp[i].startsWith('\\C')) {
                    solve += ANSWER[(i % 5) - 1] + '\n'
                }
                if(i > 0 && (i + 1) % 5 == 0) {
                    qtsSend[`question-${(i + 1) / 5}`] = qtSend
                    qtSend = {}
                }
            }
            fs.writeFile(`data/${lesson}/quiz/solve.txt`, solve, (err) => {

            })
            resolve(JSON.parse(JSON.stringify(qtsSend)))
        })
    })
}

let getLessons = () => {
    return new Promise((resolve, reject) => {
        let outcome = []
        let data = fs.readdirSync('data') 
        for(let i = 0; i < data.length; i++) {
            info = fs.readFileSync(`data/${data[i]}/lesson.json`)
            outcome.push(JSON.parse(info)['name'])
        }  
        resolve(outcome)     
    })
}

let getTestInfor = (id, lesson) => {
    return new Promise((resolve, reject) => {
        storage.createFolder(`data/${lesson}/test/${id}`)
        var infor = fs.readFileSync(`data/${lesson}/test/test.json`)
        var inf = JSON.parse(infor)
        fs.readdir(`data/${lesson}/test/${id}`, function(err, testOfID) {
            if(err) {
                inf['has_done'] = false
                inf['current_test'] = 0
            } else {
                inf['has_done'] = (testOfID.length === inf.total_test)
                inf['current_test'] = testOfID.length
            }
            resolve(JSON.stringify(inf))
        })
    })
}

module.exports = {
    submitQuestion: submitQuestion,
    getResult: getResult,
    getQuestion: getQuestion,
    getLessons: getLessons,
    getTest: getTest,
    submitTest: submitTest,
    getTestInfor: getTestInfor
}