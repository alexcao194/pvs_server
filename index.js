const debug = console.log.bind(console)
const express = require("express");
const app = express();
const initAPIs = require("./src/routes/api");
const bodyParser = require('body-parser');
const { json } = require("body-parser");
const data = require('../pvs/src/storage/data')
const server = require('http').createServer(app)
const io = require("socket.io")(server);
let port = 1904;
server.listen(port, () => {
    console.log('server is running on http://localhost:1904')
})

io.on('connection', function(client)  {
    console.log('cnt')
    client.on('submit', async (value) => {
        var res = await data.submitQuestion(value.id, value.question, value.answer, `${value.lesson}`)
        client.emit('response', res)
    })
})

app.use(express.static('public'));
app.use(`/users`, express.static('users'));
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
initAPIs(app);
