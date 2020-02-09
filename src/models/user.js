const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        validate(value) {
            if (validator.contains(value.toLowerCase(), "password")) {
                throw new Error('Password cannot be "password')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }

}, {
    timestamps: true
})

//Set up relationship between User and Tasks using a virtual property: this collection is not stored in the database, just in Node 
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'

})


//This is used to hide provide data from the client
userSchema.methods.toJSON = function () {   //needs to be called '.toJSON'
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    //const token = jwt.sign({ _id: user._id.toString() }, 'thisismysecret')
    console.log(process.env.JWT_SECRET)
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}


//Custom function for the model to check login details are correct. This should give a non specific error for saftey reasons
// Static methods are available on the Model e.g. uppercase 'User'
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        console.log('About to throw isMatch error')
        throw new Error('Unable to login')
    }

    return user
}

//Middleware - Hash the plain text password before saving - This is middleware
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

//Middleware - Delete user tasks when the user is deleted
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

// const me = new User({
//     name: ' Noel   ',
//     email: 'MYEMAIL@NOEL.COM  ',
//     password: 'Pass1245'
// })

// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log(error)
// })

module.exports = User