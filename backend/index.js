const express = require("express")
const body_parser = require("body-parser")
const base = require("base-64")
const hex = require("string-hex")
const aesjs = require("aes-js")

const app = express()
const PORT = 443 

// express configuration 
app.use(body_parser.urlencoded({
    extended: true
}))

function hex_to_bytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

// aes configuration 
const iv = [
	0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
	0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F
] 

const key = [
	0x6B, 0x28, 0x31, 0x33, 0x23, 0x21, 0x31, 0x39, 
	0x21, 0x4C, 0x6C, 0x34, 0x24, 0x31, 0x22, 0x39
] 

// Backend - Routes

// API - Routes 
app.post("/client-fetch-keys", (req, res) => { // client sends here the keys
    let keys = req.body.keys 
    keys = keys.substring(0, keys.length-2);

    let aes_cbc = new aesjs.ModeOfOperation.cbc(key, iv); 
    let encrypted_bytes = aesjs.utils.hex.toBytes(keys)

    let decrypted_bytes = aes_cbc.decrypt(encrypted_bytes); 
    let decrypted_text = aesjs.utils.utf8.fromBytes(decrypted_bytes); 

    console.log(decrypted_text); 

    res.send("PIVOTER_OK\n");
})

app.listen(PORT)