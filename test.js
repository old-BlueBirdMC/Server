const Server = require('./src/Server');
const ConsoleColors = require('./src/color/ConsoleColors');
const instance = new Server();

try {
    instance.shutdown();
    console.log(ConsoleColors.green + 'All tests passed' + ConsoleColors.reset);
} catch(error) {
    console.log(ConsoleColors.Red + error + ConsoleColors.Reset);
}
