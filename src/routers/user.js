const express = require('express')
const multer = require('multer')
const sharp = require('sharp')

const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account')


const router = new express.Router()

//Creat user, i.e. sign up
// Non Async version
// router.post('/users', (req, res) => {
//     const user = new User(req.body)

//     user.save().then(() => {
//         res.send(user)
//     }).catch((e) => {
//         res.status(400).send(e)
//         // res.send(e)
//     })
// })
//Async version
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

//Login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()        //Note this is called on lower case 'user'
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

//Logout - Remove token that user is currently using. User might be logged in on another device, so we only want to remove from the device he is currently using
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).semd()
    }
})

//Logout from all devices
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})


// //Read all users - no longer used. Makes no sense if you are using auth 
// router.get('/users', auth, async (req, res) => {        //auth middleware is now the 2nd parameter to the function. Route will only run if auth calls next()
//     try {
//         const users = await User.find({})
//         res.send(users)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

//Get own user info /profile
router.get('/users/me', auth, async (req, res) => {        //auth middleware is now the 2nd parameter to the function. Route will only run if auth calls next()
    res.send(req.user)
})

//Read single user by ID - Not needed with authentification. The above is only required
// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id

//     try {
//         const user = await User.findById(_id)

//         if (!user) {
//             return res.status(404).send()
//         }

//         res.send(user)

//     } catch (e) {
//         res.status(500).send()
//     }

//     // User.findById(_id).then((user) => {
//     //     if (!user) {
//     //         return res.status(404).send()
//     //     }
//     //     res.send(user)
//     // }).catch((e) => {
//     //     res.status(500).send()
//     // })
// })

//Update User 
router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Old update that didnt use authetification. Any user could update another user.
// router.patch('/users/:id', async (req, res) => {

//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'email', 'password', 'age']
//     const isValidOperation = updates.every((update) => {
//         return allowedUpdates.includes(update)
//     })

//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid updates!' })
//     }

//     try {
//         const user = await User.findById(req.params.id)
//         updates.forEach((update) => user[update] = req.body[update])
//         await user.save()

//         //The below call bypasses middleware:
//         // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

//         if (!user) {
//             return res.status(404).send()
//         }

//         res.send(user)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })

//Delete user
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCancelEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

//No longer used with authentification
// router.delete('/users/:id', async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id)

//         if (!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

//Upload Profile Pic
const upload = multer({
    //dest: 'avatars',      //removing this as we dont want to save the image to the file system, rather to the user
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {     //check for .doc or .docx with REGEX
            return cb(new Error('Please upload a jpg, jpeg, or png file'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    //req.user.avatar = req.file.buffer             //Not needed when using sharp

    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()         //using the sharp module to normalise photos       
    req.user.avatar = buffer

    await req.user.save()
    res.send()
}, (error, req, res, next) => {                                 //Express Error handling
    res.status(400).send({ error: error.message })
})

//Delete Profile Pic

router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')    //Know this will always be png because of sharp
        res.send(user.avatar)

    } catch (e) {
        res.status(404).send()
    }
})


module.exports = router