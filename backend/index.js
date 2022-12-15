const express = require("express")
const body_parser = require("body-parser")
const base = require("base-64")


const app = express()
const PORT = 443 

// express configuration 
app.use(body_parser.urlencoded({
    extended: true
}))

// Backend - Routes

// API - Routes 
app.post("/client-fetch-keys", (req, res) => { // client sends here the keys
    let keys = req.body.keys
    console.log(base.decode(keys));


    res.send("PIVOTER_OK\n");
})

app.listen(PORT)