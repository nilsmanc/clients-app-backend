require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { MongoClient, ObjectId } = require('mongodb')

const router = express.Router()
const app = express()

app.use(express.json())
app.use(cors())
app.use('/api/clients', router)

const clientPromise = MongoClient.connect(process.env.DB_URL, {
  useUnifiedTopology: true,
  maxPoolSize: 10,
})

router.use(async (req, res, next) => {
  try {
    const client = await clientPromise
    req.db = client.db('clients_db')

    next()
  } catch (error) {
    next(error)
  }
})

const port = process.env.PORT || 3000

router.get('/', async (req, res) => {
  try {
    const db = req.db

    const clients = await db.collection('clients').find().toArray()

    res.send(clients)
  } catch (error) {
    console.log(error)
  }
})

router.post('/', async (req, res) => {
  try {
    const data = req.body
    const db = req.db

    data.createdAt = new Date().toISOString()
    data.updatedAt = new Date().toISOString()

    const { insertedId } = await db.collection('clients').insertOne(data)
    const client = await db
      .collection('clients')
      .findOne({ _id: ObjectId(insertedId) })

    res.send(client)
  } catch (error) {
    console.log(error)
  }
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})
