/******************************************\
 *  ____  _            ____  _         _  *
 * | __ )| |_   _  ___| __ )(_)_ __ __| | *
 * |  _ \| | | | |/ _ \  _ \| | '__/ _` | *
 * | |_) | | |_| |  __/ |_) | | | | (_| | *
 * |____/|_|\__,_|\___|____/|_|_|  \__,_| *
 *                                        *
 * This file is licensed under the MIT    *
 * License. To use or modify it you must  *
 * accept the terms of the license.       *
 * ___________________________            *
 * \ @author BlueBirdMC Team /            *
\******************************************/

const MinecraftTextColors = require("./MinecraftTextColors");

class ConsoleColors {
    static bold = "\u001b[1m";
    static obfuscated = "";
    static italic = "\u001b[3m";
    static underline = "\u001b[4m";
    static strike = "\u001b[9m";
    static reset = "\u001b[m";
    static black = "\u001b[38;5;16m";
    static darkPurple = "\u001b[38;5;19m";
    static darkGreen = "\u001b[38;5;3m";
    static darkAqua = "\u001b[38;5;37m";
    static darkRed = "\u001b[38;5;124m";
    static darkGray = "\u001b[38;5;59m";
    static gold = "\u001b[38;5;214m";
    static gray = "\u001b[38;5;145m";
    static blue = "\u001b[38;5;63m";
    static green = "\u001b[38;5;83m";
    static aqua = "\u001b[38;5;87m";
    static red = "\u001b[38;5;203m";
    static purple = "\u001b[38;5;207m";
    static yellow = "\u001b[38;5;227m";
    static white = "\u001b[38;5;231m";
    static minecoinGold = "\u001b[38;5;185m";

    static McClrToConsole(message) {
        if (message.indexOf("§") !== -1) {
            const clr = message.charAt(message.indexOf("§") + 1);
            switch ("§" + clr) {
                case MinecraftTextColors.black:
                    message = message.replace("§" + clr, ConsoleColors.black);
                    break;
                case MinecraftTextColors.darkBlue:
                    message = message.replace("§" + clr, ConsoleColors.darkBlue);
                    break;
                case MinecraftTextColors.darkGreen:
                    message = message.replace("§" + clr, ConsoleColors.darkGreen);
                    break;
                case MinecraftTextColors.darkAqua:
                    message = message.replace("§" + clr, ConsoleColors.darkAqua);
                    break;
                case MinecraftTextColors.darkRed:
                    message = message.replace("§" + clr, ConsoleColors.darkRed);
                    break;
                case MinecraftTextColors.darkPurple:
                    message = message.replace("§" + clr, ConsoleColors.darkPurple);
                    break;
                case MinecraftTextColors.gold:
                    message = message.replace("§" + clr, ConsoleColors.gold);
                    break;
                case MinecraftTextColors.gray:
                    message = message.replace("§" + clr, ConsoleColors.gray);
                    break;
                case MinecraftTextColors.darkGray:
                    message = message.replace("§" + clr, ConsoleColors.darkGray);
                    break;
                case MinecraftTextColors.blue:
                    message = message.replace("§" + clr, ConsoleColors.blue);
                    break;
                case MinecraftTextColors.green:
                    message = message.replace("§" + clr, ConsoleColors.green);
                    break;
                case MinecraftTextColors.aqua:
                    message = message.replace("§" + clr, ConsoleColors.aqua);
                    break;
                case MinecraftTextColors.red:
                    message = message.replace("§" + clr, ConsoleColors.red);
                    break;
                case MinecraftTextColors.purple:
                    message = message.replace("§" + clr, ConsoleColors.purple);
                    break;
                case MinecraftTextColors.yellow:
                    message = message.replace("§" + clr, ConsoleColors.yellow);
                    break;
                case MinecraftTextColors.white:
                    message = message.replace("§" + clr, ConsoleColors.white);
                    break;
                case MinecraftTextColors.minecoinGold:
                    message = message.replace("§" + clr, ConsoleColors.minecoinGold);
                    break;
                case MinecraftTextColors.bold:
                    message = message.replace("§" + clr, ConsoleColors.bold);
                    break;
                case MinecraftTextColors.underline:
                    message = message.replace("§" + clr, ConsoleColors.underline);
                    break;
                case MinecraftTextColors.itallic:
                    message = message.replace("§" + clr, ConsoleColors.itallic);
                    break;
                case MinecraftTextColors.magic:
                    message = message.replace("§" + clr, ConsoleColors.magic);
                    break;
                case MinecraftTextColors.strike:
                    message = message.replace("§" + clr, ConsoleColors.strike);
                    break;
                case MinecraftTextColors.reset:
                    message = message.replace("§" + clr, ConsoleColors.reset);
                    break;
            }
        }
        return message;
    }
}

module.exports = ConsoleColors;
