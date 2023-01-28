const path = require("path");
const fs = require("fs");

const Logger = require("./console/Logger");
const log = new Logger({Name: "Loader", AllowDebugging: false, WithColors: true});

let startTime = Date.now();
console.log(startTime)

log.info("Loading worlds");
if (!(fs.existsSync("worlds"))) {
    fs.mkdirSync("worlds");
}
log.info("Worlds Loaded");
log.info("Loading PlayersData");
if (!(fs.existsSync("players_data"))) {
    fs.mkdirSync("players_data");
}
log.info("PlayersData Loaded");
log.info("Loading Plugins");
if (!(fs.existsSync("plugins"))) {
    fs.mkdirSync("plugins");
}
    