var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.transfer && creep.carry.energy == 0) {
            creep.memory.transfer = false;
            creep.say('⚡ H: Hrv');
        }
        else if (!creep.memory.transfer && creep.carry.energy < creep.carryCapacity) {
            creep.memory.transfer = false;
            creep.say('⚡ H: Hrv');
        }
        else if (!creep.memory.transfer && creep.carry.energy == creep.carryCapacity) {
            creep.memory.transfer = true;
            creep.say('🔄 H: Transfer');
        }

        if (creep.memory.transfer) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            var target = creep.pos.findClosestByPath(targets);
            
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: 'yellow'}});
                }
            }
            else {
                creep.moveTo(15, 35);
            }
            /*
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            */
        }

        else {
            var sources = creep.room.find(FIND_SOURCES);
            var targetSource = creep.pos.findClosestByPath(sources);
            //var targetSource = creep.pos.findClosestByRange(sources);
            if(creep.harvest(targetSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targetSource, {visualizePathStyle: {stroke: 'yellow'}});
            }
        }



    }
};

module.exports = roleHarvester;