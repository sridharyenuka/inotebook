const connectToMongo=require('./db');
const express = require('express')

connectToMongo()

const app = express();
const port=5502;

app.use(express.json())
// respond with "hello world" when a GET request is made to the homepage

//Available Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))
app.listen(port,()=>{
    console.log(`Example app listening at http://localhost:${port}`)
})