const express = require('express');
const app = express();
const port = 4966;

app.get('/', (req, res) => {
  res.send(', World!');
});

app.listen(port, '0.0.0.0' ,() => {
  console.log(`Express app listening at http://localhost:${port}`);
});
