module.exports = {
    run(role, count, body) {
        var roleGroup = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        if (Game.time % 100 == 0) {
            console.log(role + 's: ' + roleGroup.length);
        }

        if (roleGroup.length < count) {
            var newName = role + Game.time;
            console.log('Spawning new ' + role + ': ' + newName);
            Game.spawns['Spawn1'].spawnCreep(body, newName, { memory: { role: role } });
        }
    }
};