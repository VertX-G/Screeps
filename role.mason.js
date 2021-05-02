var roleMason = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.say('⚡ M: Hrv');
        }
        else if (!creep.memory.repairing && creep.carry.energy < creep.carryCapacity) {
            creep.memory.repairing = false;
            creep.say('⚡ M: Hrv');
        }
        else if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
            creep.say('🧱 M: Fortify');
        }

        if (creep.memory.repairing) {
            const targets = creep.room.find(FIND_STRUCTURES, {
                //filter: object => object.hits < object.hitsMax
                filter: function (object) {
                    return object.structureType === STRUCTURE_WALL && (object.hits < object.hitsMax);
                }
            });

            if (targets.length > 0) {
                targets.sort((a, b) => a.hits - b.hits);
                /*
                var primaryTargets = all targets where targets.hits = targets[0].hits;
                var primaryTargets =_(targets).filter( {hits: target[0].hits} ).value()
                var target = findClosestByRange(primaryTargets);
                if (target.length > 0) {
                    console.log('Current target: ' + target[0]);
                    if (creep.repair(target[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                */

                var primaryTargets = _(targets).filter({ hits: targets[0].hits }).value();
                var target = creep.pos.findClosestByPath(primaryTargets);
                if (Game.time % 20 == 0) {
                    console.log('Current target: ' + target + ' hits: ' + target.hits);
                }
                
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
            else {
                creep.moveTo(12, 30);
            }

            

            /*
            if (targets.length > 0) {
                console.log('First target to repair: ' + targets[0]);
                if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            */
        }

        else {
            var sources = creep.room.find(FIND_SOURCES);
            var targetSource = creep.pos.findClosestByPath(sources);
            if (creep.harvest(targetSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targetSource, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }

    }
};

module.exports = roleMason;