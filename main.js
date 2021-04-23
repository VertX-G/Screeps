/*

TODO:
• simplify role.mason sorts and filters
• figure out how to use containers
• figure out how to get creeps to get energy from containers and spawn instead of sources
    • This will also mean I can have a group of harvesters that can fill spawn and containers
    and the rest can just collect energy from there to use
• figure out how to streamline the creeps' targets:
    selecting target
    saving target name in memory
    doing something with target until that thing is done
    only then re-processing to find new target

*/

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleMason = require('role.mason');
var spawnNewCreep = require('action.spawnCreep');

module.exports.loop = function () {

    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        /*
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
        */

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    spawnNewCreep.run('harvester', 2, [WORK, WORK, WORK, CARRY, MOVE]);
    spawnNewCreep.run('builder', 5, [WORK, WORK, CARRY, CARRY, MOVE, MOVE]);
    spawnNewCreep.run('repairer', 3, [WORK, CARRY, MOVE]);
    spawnNewCreep.run('upgrader', 6, [WORK, WORK, CARRY, CARRY, MOVE, MOVE]);
    spawnNewCreep.run('mason', 10, [WORK, CARRY, MOVE, MOVE, MOVE]);

    // streamline this with a loop
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