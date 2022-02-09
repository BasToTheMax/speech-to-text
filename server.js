const express = require('express');
const app = express();
app.get('*node_modules*',(req,res)=>{});
app.get('/server.js',(req,res)=>{});
app.use(express.static(__dirname+'/'));
app.listen(5500,() =>{console.log(`App online at port 5500!`);});