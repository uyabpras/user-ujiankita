require('dotenv').config();
const express = require('express')
const app = express()
const port = process.env.PORT || 3001

const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
// const roleRoutes = require('./routes/roleRoutes')
const authRoutes = require('./routes/userRoutes')
const { createTask, updateTask } = require('./config/kafka');

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));
app.use('/api/user', authRoutes);
// app.use('/api/role', roleRoutes);

const db = require("./db/connect");
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.get('/', (req, res) => {
  res.send('Hello World!')
})

Promise.all([createTask(), updateTask()])
  .then(() => {
    console.log('All Kafka producers connected and sent messages.');
  })
  .catch((error) => {
    console.error('Error connecting to Kafka:', error);
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})