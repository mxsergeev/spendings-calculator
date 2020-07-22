const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.set('port', (process.env.PORT || 3000));

app.use(express.static(path.join(__dirname, 'public')));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());

app.get('*', (req, res) => {
  res.render('spendings.html');
});

app.listen(process.env.PORT || 3000, () => {
    console.log('App listening on PORT', process.env.PORT || '3000');
});