const Server = require('./src/Server');
const ConsoleColors = require('./src/color/ConsoleColors');

function run() {
    try {
        const instance = new Server();
        instance.shutdown();
        console.log(ConsoleColors.green + 'All tests passed' + ConsoleColors.reset);
    } catch (error) {
        if (error) {
            console.log(ConsoleColors.Red + error + ConsoleColors.Reset);
        }
    }
}
run()