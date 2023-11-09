require('dotenv').config()
const express = require('express')
const cors = require('cors')

const router = express.Router()
const app = express()

app.use(express.json())
app.use(cors())
app.use('/api/clients', router)

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})
