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
• add a console.log that prints the amount of energy required for the next creep to spawn
    
would be a good idea to put special code bit into any creep role that has WORK and CARRY bits to be able to boost your controller up in case it slips below 1/2 of ticks-to-downgrade for its level (CONTROLLER_DOWNGRADE constant)

*/

/*
Creep say things:\
creep.say('⚡ X: Hrv');
creep.say('🔧 U: Upgrade');
creep.say('🛠️ R: Repair');
creep.say('🔄 X: Transfer');
creep.say('🚧 B: Build');
creep.say('🧱 M: Fortify');
*/

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleMason = require('role.mason');
var roleArtillery = require('role.artillery');
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
        if ((!Game.creeps[name]) && (Game.time % 100 == 0)) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    /*
    if (Game.time % 5 == 0) {
        var R1energyCapacity=Game.rooms.W27S55.energyCapacityAvailable;
        var R1energyAvailable =Game.rooms.W27S55.energyAvailable;
        console.log("Room 1 energy: "+R1energyAvailable+" out of "+R1energyCapacity+" Max");
    }
    */

    Game.spawns['Spawn1'].room.visual.text(
        // figure out how to make new line
        //"Energy: "+Game.rooms.W27S55.energyAvailable+" / "+Game.rooms.W27S55.energyCapacityAvailable + '\n' +
        "Energy: "+Game.rooms.W27S55.energyAvailable+" / "+Game.rooms.W27S55.energyCapacityAvailable + '\n',
        Game.spawns['Spawn1'].pos.x - 2, 
        Game.spawns['Spawn1'].pos.y - 4, 
        {size:'0.5', align: 'left', opacity: 0.8, 'backgroundColor': '#A3E4D7', color:'black'});

    /*
    to implement some kind of priority system when spawning creeps:
    make a list of dictionaries
    loop through list (for each i in list)
    if currentCount < requiredCount, make creep and break from loop
    */
    

    // var checkGroup = _.filter(Game.creeps, (creep) => creep.memory.role == role);
    if ((_.filter(Game.creeps, (creep) => creep.memory.role == 'harvester')).length < 2 || (_.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader')).length < 1) {
        console.log('*** EMERGENCY SPAWN REQUIRED ***');
        spawnNewCreep.run('harvester', 2, [WORK, CARRY, MOVE]);
        spawnNewCreep.run('upgrader', 1, [WORK, CARRY, MOVE]);
    }
    else if ((_.filter(Game.creeps, (creep) => creep.memory.role == 'harvester')).length < 4) {
        spawnNewCreep.run('harvester', 4, [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]);
    }
    else {
        // First Stage Creeps
        /*
        spawnNewCreep.run('harvester', 5, [WORK, CARRY, MOVE, MOVE]);
        spawnNewCreep.run('upgrader', 5, [WORK, WORK, CARRY, MOVE]);
        spawnNewCreep.run('repairer', 1, [WORK, CARRY, MOVE, MOVE]);
        spawnNewCreep.run('builder', 6, [WORK, WORK, CARRY, MOVE, MOVE]);
        spawnNewCreep.run('mason', 3, [WORK, WORK, CARRY, MOVE, MOVE]);
        */

        // Second Stage Creeps
        // in reverse order of importance because last one called will be spawned
        spawnNewCreep.run('artillery', 1, [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]);
        spawnNewCreep.run('mason', 2, [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]);
        spawnNewCreep.run('builder', 3, [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]);
        spawnNewCreep.run('repairer', 2, [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]);
        spawnNewCreep.run('upgrader', 4, [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]);
        spawnNewCreep.run('harvester', 4, [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]);
    }

    var currentlySpawning = Game.spawns['Spawn1'].spawning;
    if (currentlySpawning != null && currentlySpawning.remainingTime == currentlySpawning.needTime -1) {
        console.log('Spawning: ' + Game.spawns['Spawn1'].spawning.name);
    }

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

        if (creep.memory.role == 'artillery') {
            roleArtillery.run(creep);
        }
    }

    /*
// add this to make spawns show spawning percentage complete and make it show energy status

    StructureSpawn.prototype.Notifications =
    function () {
        for (let spawnName in Game.spawns) {

            if(Game.spawns[spawnName].spawning) { 
                var spawningCreep = Game.creeps[Game.spawns[spawnName].spawning.name];
                var Percentage = (((Game.spawns[spawnName].spawning.needTime - Game.spawns[spawnName].spawning.remainingTime) / Game.spawns[spawnName].spawning.needTime)*100).toFixed(2);
                var symbol = '\uD83D\uDEA7';
                Game.spawns[spawnName].room.visual.text(
                    symbol + spawningCreep.memory.role + ' ' + Percentage +'%',
                    Game.spawns[spawnName].pos.x + 1.5, 
                    Game.spawns[spawnName].pos.y, 
                    {size:'0.5', align: 'left', opacity: 0.8, 'backgroundColor': '#A3E4D7', color:'black'});
            }
        }
    };
    */

}

/*
// Add this to keep a list of my rooms in memory

if (Game.time % 100 == 0) { updateRoomList(); }

const updateRoomList = function () {
	const myRooms = [];
	for (const roomName in Game.rooms) {
		if (Game.rooms[roomname].controller && Game.rooms[roomname].controller.my) {
			Memory.myRooms.push(roomName);
		}
	}
	if (myRooms.length) {
		Memory.myRooms = myRooms;
	}
}
*/

