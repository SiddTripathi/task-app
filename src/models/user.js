const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwtoken = require('jsonwebtoken')
const Task = require('../models/task')


//converting user object into schema so that middleware function can be aded. Although mongoose converts a object in schema automatically
//but to introduce middleware, we need to convert it to schema first.
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('This email is not valid')
            }

        }

    },
    age: {
        type: Number,
        trim: true,
        default: 18,
        validate(value) {
            if (value < 18) {
                throw new Error('Age must be above 18')
            }
        }
    },
    password: {
        type: String,
        trim: true,
        minlength: 6,
        validate(value) {
            if (value.includes('password')) {
                throw new Error('Password cannot be password')
            }
        }

    },
    tokens: [{
        token: {
            required: true,
            type: String
        }
    }],
    avatar: {
        type: Buffer     //inorder to add image in document, we need to add this field. The image will be stored in binary format. 
        // This is done because cloud deployment does not support file system storage and image data is lost.
    }
}, {
    timestamps: true
})



/*now here in order to get details of task created by user, we are creating a virtual property - this is quite similar to primary
foreign key concept of SQL. This virtual property is not actually stored in ths model but is reference of something stored in task
model

--> Since this is a virtual property, so alongwith the reference ref, we also have to define the fields of User and Task models
which form the relation of these two models

--> localField - entity which is present in User model or we can say is primary key here. 
--> foreignField - the same id of user is a foreign key in task model and thus the two models are connected by the User ids.

In short we can say that user ID is present locally(User model) and remotely (Task Model) and is a common factor which connects two models.

*/

userSchema.virtual('userTasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'

})

//function to remove confidential data like passwords and tokens when user data is returned.

userSchema.methods.toJSON = function () {

    const user = this                  //user object data is returned for this schema (user schema). Hence not used arrow function
    const userObject = user.toObject() // .toObject method gives the raw data from user object. 

    delete userObject.password  //delete is the operator used to delete elements from the object.
    delete userObject.tokens
    delete userObject.avatar //delete avatar as we already have a url for fetching it. 

    return userObject


}


//function to generate web tokens for each user. Now here we use .methods instead of .statics because statics is called
//for entire model whereas methods are called at particular instances. Here for each user(instance) it is called. 
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = await jwtoken.sign({ _id: user._id.toString() }, process.env.JWT_TOKEN)//generating the tokens using Ids of users

    user.tokens = user.tokens.concat({ token }) //concating the tokens added upon each request. 
    await user.save()
    return token


}

//function to verify credentials
userSchema.statics.findByCredential = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new error('Unable to login')
    }
    const isMatchPassword = await bcrypt.compare(password, user.password)
    if (!isMatchPassword) {
        throw new error('Unable to login')
    }
    return user
}



//middleware function. The .pre function used here is implemeted on all document.save instance for passwords( if condition)
//'this' is used to access user documents.
//'next' is used to end the function so that machine can know that now user can be saved
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {

        user.password = await bcrypt.hash(user.password, 8)

    }

    next()
})

//deletes user task when user is removed. The .pre function is implemented on remove method for documents when user is removed


userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})



//Using schema to create/update model

const User = mongoose.model('User', userSchema)

module.exports = User