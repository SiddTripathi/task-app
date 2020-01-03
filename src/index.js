//importing express and creating app
const express = require('express')
const app = express()
require('./db/mongoose') //importing mongoose db connection
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const port = process.env.PORT   //Creating local port for application

//middleware functions - used to execute a function before running a route handlerss. 




// const multer = require('multer')


// //below is creating the instance of multer tool and providing options for that tool inside the multer object . currently providing
// //destination folder where images will be stored
// const upload = multer({
//     dest: 'images'
// })

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// })





app.use(express.json())  //Automatically parses incoming JSON into Object format

app.use(userRouter) //creating routes for user router

app.use(taskRouter) // creating routes for task router


//Creating local port for application
app.listen(port, () => {
    console.log('App is up on port ' + port)
})


//bcrypt library is used for encrypting the password from plain text format. 

// const bcrypt = require('bcryptjs')

// const myFunction = async () => {
//     const plainPassword = 'Happy123!'
//     const hashedPassword = await bcrypt.hash(plainPassword, 8) // hash(password to be converted, number of times algorithm should run)
//     // 8 is ideal iteration number for algorithm to create a easy yet secure has
//     console.log(plainPassword)
//     console.log(hashedPassword)

//     const compare = await bcrypt.compare(plainPassword, hashedPassword) //for password comparing and matcing
//     console.log(compare)
// }
// myFunction()


// //practising JSON Webtokens -library used is jsonwebtoken
// const jwtoken = require('jsonwebtoken')

// const tokenFunction = async () => {
//     const token = await jwtoken.sign({ _id: 'Hello1234' }, 'thisisanothercourse')
//     console.log(token)

//     const data = await jwtoken.verify(token, 'thisisanothercourse')
//     console.log(data)
// }

// tokenFunction()

//now if we want to get user details from task that is which user created this task

// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {

//     /*
//     now the below code is used to get user details from task id.

//     const task = await Task.findById('5deae8405ec20567a491d300')
//     await task.populate('owner').execPopulate() //this line here will populate the entire document of that ID as refered in owner
//     // that is why we provided reference in task model
//     console.log(task.owner)*/

//     /*Now writing code for getting details of task created by the partiular user.*/
//     // const user = await User.findById('5deae78dcb19494d70c65f6e')
//     // // console.log(user)
//     // await user.populate('tasks').execPopulate()
//     // console.log(user.tasks)


// }

// main()


