const cache = require('../gather/cache');
const { getModulePathFor } = require('./get-module-path-for');

const CACHE_KEY = 'telemetry';

function setTelemetry(newTelemetry) {
  setTelemetryWithKey(CACHE_KEY, newTelemetry);
}

function setTelemetryWithKey(cacheKey, newTelemetry) {
  let data = JSON.stringify(newTelemetry);
  cache.set(cacheKey, data);
}

function getTelemetry(cacheKey) {
  cacheKey = cacheKey || CACHE_KEY;
  let telemetryExists = cache.has(cacheKey);

  if (!telemetryExists) {
    return {};
  }

  let telemetryData = cache.get(cacheKey).value;
  let telemetry = {};

  try {
    telemetry = JSON.parse(telemetryData);
  } catch (e) {
    console.error('Error parsing telemetry', e.message);
  }

  return telemetry;
}

/**
 * Get the runtime data for the file being transformed
 *
 * @param {String} filePath Absolute path of the file to read data from
 * @returns {Object} Runtime configuration object
 */
function getTelemetryFor(filePath) {
  let modulePath = getModulePathFor(filePath);
  let moduleKey = _generateModuleKey(modulePath);
  let data = getTelemetry()[moduleKey];

  return data;
}

function _generateModuleKey(modulePath) {
  let moduleKey = modulePath.replace('templates/components/', 'components/');
  // If `templates/` still exists in the path then it wasn't a component but a controller-level template instead
  return moduleKey.replace('templates/', 'controllers/');
}

module.exports = {
  getTelemetry,
  setTelemetry,
  setTelemetryWithKey,
  getTelemetryFor,
};
