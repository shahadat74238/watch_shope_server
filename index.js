const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Time Tell site is Running.....!');
})

app.listen(port, () => {
  console.log(`Time Tell site is Running on port ${port}`)
})