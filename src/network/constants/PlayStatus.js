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

class PlayStatus {
    static loginSuccess = 0;
    static loginFailedClient = 1;
    static loginFailedServer = 2;
    static playerSpawn = 3;
    static loginFailedInvalidTenant = 4;
    static loginFailedVanillaEdu = 5;
    static loginFailedEduVanilla = 6;
    static loginFailedServerFull = 7;
    static loginFailedEditorVanilla = 8;
    static loginFailedVanillaEditor = 9;
}

module.exports = PlayStatus;
