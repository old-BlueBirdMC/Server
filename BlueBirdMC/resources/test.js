const Server = require("../Server");
const ConsoleColors = require("../color/ConsoleColors");

try {
    const instance = new Server();
    instance.shutdown();
    console.log(ConsoleColors.green + "All tests passed" + ConsoleColors.reset);
} catch (error) {
    console.log(ConsoleColors.red + error.message + ConsoleColors.reset);
    console.log(ConsoleColors.red + "Test `" + error + "` Failed" + ConsoleColors.reset);
    return error;
}
