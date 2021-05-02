var roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('⚡ B: Hrv');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 B: Build');
        }

        if (creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: 'red' } });
                }
            }
            else {
                creep.moveTo(24, 43);
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            var targetSource = creep.pos.findClosestByRange(sources);
            if (creep.harvest(targetSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targetSource, { visualizePathStyle: { stroke: 'red' } });
            }

        }
    }
};

module.exports = roleBuilder;