const express = require('express')

require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000


//File upload with Multer. Saves to the directory images (gets created if it does not exist)
// const multer = require('multer')
// const upload = multer({      //Need a separate instance of multer for each upload type
//     dest: 'images',
//     limits: {
//         fileSize: 1000000,          //Approx 1MB
//     },
//     fileFilter(req, file, cb) {
//         // if (!file.originalname.endsWith('.pdf')) {        //check for PDF
//         if (!file.originalname.match(/\.(doc|docx)$/)) {     //check for .doc or .docx with REGEX
//             return cb(new Error('Please upload a PDF'))
//         }
//         cb(undefined, true)
//     }
// })

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// }, (error, req, res, next) => {                     //Error handling. Needs to have 4 arguments so that Express knows that its for error handling
//     res.status(400).send({ error: error.message })
// })

//Express Middleware
// Gets executed before routers

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests disabled')
//     } else {
//         next()      //Next needs to be called to 'Exit' / move onto the next middleware if no response is sent!
//     }
// })

//Maintenance Mode Middleware Example
// app.use((req, res, next) => {
//     res.status(503).send('Server temporarily down for maintenance')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ', port)
})

const Task = require('./models/task')
const User = require('./models/user')

const main = async () => {
    // FIND OWNER OF TASK
    // const task = await Task.findById('5e3a6fdaa59bea1820792348')
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)

    //FIND TASKS BELONGING TO OWNER
    // const user = await User.findById('5e393a020480ef37840c211e')
    // await user.populate('tasks').execPopulate()
    // console.log(user.tasks)

}

main()

    // Experitmenting with JWT - Jason Web Token
    // const jwt = require('jsonwebtoken')

    // const myFunction = async () => {
    //     const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', { expiresIn: '7 days' })
    //     console.log(token)

    //     const data = jwt.verify(token, 'thisismynewcourse')
    //     console.log(data)
    // }
    // myFunction()