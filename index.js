const express = require('express')
const bodyParser = require("body-parser");
const { queryParser } = require("express-query-parser");
const cors = require("cors");
const db = require('./Config/DB/tle.db');

const { networkInterfaces } = require('node:os')


const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger/swagger.json');
// const swaggerMaster = require('./swagger/swagger.json')


require('dotenv')  


const app = express();

app.set('trust proxy', true)
 
const nets = networkInterfaces();
const results = Object.create(null);
for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
    if (net.family === familyV4Value && !net.internal) {
      if (!results[name]) {
        results[name] = [];
      }
      results[name].push(net.address);
    }
  }
}
// process.env.HOST=results.Ethernet0[0]||results.Ethernet[0]


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("./public"))
app.use('./public/image', express.static('image'))
app.use(cors());
app.use(
  queryParser({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true,
  })
);
// database connection
db;




// // router use
app.use('/api',require("./Router/router"))

// //swagger
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerMaster));


// app.use('/api',router)


app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://${process.env.HOST}:${process.env.PORT}`)
})
