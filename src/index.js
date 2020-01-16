const app = require('./app')


const port = process.env.PORT   //Creating local port for application



//Creating local port for application
app.listen(port, () => {
    console.log('App is up on port ' + port)
})






