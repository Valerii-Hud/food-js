const path = require('path');
const express = require('express');
const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.post('/', (req, res) => {
  console.log('Odebrano dane:', req.body);
  res.json(req.body);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
