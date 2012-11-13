<<<<<<< .mine
/**
 * @author rishabhmhjn
 *
 *
 */











=======
/**
 * @author rishabhmhjn
 */

var nodejs_solr = module.exports = require('./lib'), logger = require('nlogger')
    .logger(module);

var doc = new nodejs_solr.document();

doc.setMultiValue("name", "Rishabh Mahajan");
doc.setMultiValue("name", "Tushar Mahajan");

logger.debug(doc);

doc.clear();

>>>>>>> .theirs
logger.debug(doc);
