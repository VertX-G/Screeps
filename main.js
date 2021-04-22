var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleMason = require('role.mason');
var spawnNewCreep = require('action.spawnCreep');

module.exports.loop = function () {

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    spawnNewCreep.run('harvester', 2, [WORK, WORK, WORK, CARRY, MOVE]);
    spawnNewCreep.run('builder', 3, [WORK, CARRY, MOVE]);
    spawnNewCreep.run('repairer', 3, [WORK, CARRY, MOVE]);
    spawnNewCreep.run('upgrader', 6, [WORK, WORK, CARRY, CARRY, MOVE, MOVE]);
    spawnNewCreep.run('mason', 10, [WORK, CARRY, MOVE, MOVE, MOVE]);

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }

        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }

        if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }

        if (creep.memory.role == 'mason') {
            roleMason.run(creep);
        }
    }
}