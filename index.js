const {client} = require('./db/index.js');
const PORT = 3000;
const express = require('express');
const app = express();

const morgan = require ('morgan');
const apiRouter = require('./api');

app.use(express.json())
app.use(morgan('dev'))
app.use('/api', apiRouter);

client.connect();

app.get('/background/:color', (req, res, next) => {
  res.send(`
    <body style="background: ${ req.params.color };">
      <h1>Hello World</h1>
    </body>
  `);
});

app.get('/add/:first/to/:second', (req, res, next) => {
  res.send(`<h1>${ req.params.first } + ${ req.params.second } = ${
    Number(req.params.first) + Number(req.params.second)
   }</h1>`);
});




app.get('/', (req, res, next)=>{
  res.send('<div>Damn Drew</div>');
  console.log('get request here');
  next();
})


app.listen(PORT, () => {
  console.log("The server is up up up up up up up up up up up", PORT);
})