const express = require('express')
const router = new express.Router() //creating routers from expressy
const User = require('../models/user')
const sharp = require('sharp')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/accounts') //importing email methods from accounts.js
const multer = require('multer')
const upload = multer({
    // dest: 'avatar', --> this is commented so that image is not saved in avatar folder but instead passed along request so that it can be stored in mongodb
    limits: {
        fileSize: 1000000 //this sets limitation on file size which is being uploaded. It is in bytes. So for limit of 1 MB, 1000000 bytes
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true) //calling call back function with undefined error argument as no error is there and second argument true i.e accpeting ulpoad
    }

})



//user logging in
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredential(req.body.email, req.body.password) //this findBy Credential is a new method created by us -> we then define this function in user Model
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()

    } catch (e) {
        res.status(500).send(e)
    }

})

//setting post method for users create user

router.post('/users', async (req, res) => {

    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

//find all users
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

//find user by id
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//update user

router.patch('/users/me', auth, async (req, res) => {

    const updated = Object.keys(req.body) //to handle situtation if user tries to update fields which do not exists in User
    const updatesAllowed = ['name', 'email', 'password', 'age'] //array of fields which can be updated
    const validUpdate = updated.every((update) => updatesAllowed.includes(update)) //function checking whether updated field (keys) are valid or not
    if (!validUpdate) {
        return res.status(400).send({ error: 'not a valid update' })
    }

    try {
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }) this findByIdAndUpdate
        //bypasses advanced mongoose functions such as middleware in our case, therefore commenting it and adding new code.

        // const user = await User.findById(req.params.id)
        updated.forEach((updates) => {
            req.user[updates] = req.body[updates] // this is a dynamic update and therefore whatver user passes in body to update gets
            // updateed in 'user' according to the filed (forEach-->update - carries field for iteration)

        })
        await req.user.save()
        // if (!user) {
        //     return res.status(404).send() --> not needed as now authorized user is coming from auth middleware.
        // }
        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//delete user

router.delete('/users/me', auth, async (req, res) => {
    try {

        await req.user.remove()
        sendCancelEmail(req.user.email, req.user.name) // sends a mail when account is deleted
        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//uploading file to user model --> upload.single(method)
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    //using sharp, we can resize,change format to png etc for image uploaded
    const buffer = await sharp(req.file.buffer).resize({ width: 300, height: 300 }).png().toBuffer()
    req.user.avatar = buffer //this will put uploaded image to avatar field of user model.
    await req.user.save() //saving user after update
    res.send()

}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

//deleting uploaded file.
router.delete('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar = undefined
    req.user.save()
    res.send(req.user)
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

//fetching a image from db

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(500).send(e)
    }
})



module.exports = router