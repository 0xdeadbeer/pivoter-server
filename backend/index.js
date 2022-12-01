const express = require("express")
const app = express()
const PORT = 443 


app.get("/", (req, res) => {
    res.send("hello world\n");
})

app.listen(PORT)