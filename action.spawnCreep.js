module.exports = {
    run(role, count, body) {
        var roleGroup = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        if (Game.time % 20 == 0) {
            console.log(role + 's: ' + roleGroup.length);
        }

        if (roleGroup.length < count) {
            var newName = role + Game.time;
            if (Game.spawns['Spawn1'].spawnCreep(body, newName, { memory: { role: role } }) == 0) {
                //console.log('Spawning: ' + newName);
            }
            
        }
        
    }
};

//Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], 'harvester'+Game.time, { memory: { role: 'harvester' } });

/*
StructureSpawn.spawning == 0
StructureSpawn.spawning.name
Game.spawns['Spawn1'].spawning.name
*/