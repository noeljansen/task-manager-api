// CRUD = Create Read Update Delete

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID

const { MongoClient, ObjectID } = require('mongodb')

//const connectionUrl = 'mongodb://127.0.0.1:27017'
const connectionUrl = process.env.MONGODB_URL
console.log('In MongoDB: ' + process.env.MONGODB_URL)
const databaseName = 'task-manager'

// const id = new ObjectID()
// console.log(id)
// console.log(id.getTimestamp())



MongoClient.connect(connectionUrl, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!')
    }
    console.log('Connected correctly!')

    const db = client.db(databaseName)

    //  --INSERTING INTO DB--

    // db.collection('users').insertOne({
    //     name: 'Vikram',
    //     age: 26
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert user')
    //     }
    //     console.log(result.ops)
    // })

    // db.collection('users').insertMany([
    //     {
    //         name: 'Jen',
    //         age: 28
    //     }, {
    //         name: 'Gunther',
    //         age: 27
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert documents')
    //     }

    //     console.log(result.ops)
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Task 1',
    //         completed: true
    //     }, {
    //         description: 'Task 2',
    //         completed: false
    //     }, {
    //         description: 'Task 3',
    //         completed: true
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert documents into tasks collection')
    //     }

    //     console.log(result.ops)
    // })

    //     --READING FROM DB--

    // db.collection('users').findOne({ _id: new ObjectID("5e302f17c3e2b04a602681b1") }, (error, user) => {
    //     if (error) {
    //         return console.log('Unable to fetch user')
    //     }
    //     console.log(user)
    // })

    // db.collection('users').find({ age: 27 }).toArray((error, users) => {
    //     console.log(users)
    // })

    // db.collection('users').find({ age: 27 }).count((error, users) => {
    //     console.log(users)
    // })

    // db.collection('tasks').findOne({ _id: new ObjectID("5e301c4b18733740f4b59e30") }, (error, task) => {
    //     if (error) {
    //         return console.log('Unable to fetch task')
    //     }
    //     console.log(task)
    // })

    // db.collection('tasks').find({ completed: false }).toArray((error, tasks) => {
    //     if (error) {
    //         return console.log('Error finding tasks')
    //     }
    //     console.log(tasks)
    // })

    //     --UPDATING DB--
    // const updatePromise = db.collection('users').updateOne({
    //     _id: new ObjectID("5e3019975913fd4420e39268")
    // }, {
    //     $set: {
    //         name: 'Mike'
    //     }
    // })

    // updatePromise.then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('users').updateOne({
    //     _id: new ObjectID("5e3019975913fd4420e39268")
    // }, {
    //     $set: {
    //         name: 'Mike'
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('users').updateOne({
    //     _id: new ObjectID("5e3019975913fd4420e39268")
    // }, {
    //     $inc: {
    //         age: 1
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('tasks').updateMany({
    //     completed: false
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log(result.modifiedCount)
    // }).catch((error) => {
    //     console.log(error)
    // })

    //     --DELETING FROM DB--

    // db.collection('users').deleteMany({
    //     age: 27
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    db.collection('tasks').deleteOne({
        description: 'Task 1'
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

})

