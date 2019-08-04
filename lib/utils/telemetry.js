const cache = require('../gather/cache');
const { getModulePathFor } = require('./get-module-path-for');

const CACHE_KEY = 'telemetry';

function setTelemetry(newTelemetry) {
  cache.set(CACHE_KEY, JSON.stringify(newTelemetry));
}

function getTelemetry() {
  let telemetryExists = cache.has(CACHE_KEY);

  if (!telemetryExists) {
    return {};
  }

  let telemetryData = cache.get(CACHE_KEY);
  let telemetry = JSON.parse(telemetryData).value;

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
  let data = getTelemetry()[modulePath];

  return data;
}

module.exports = {
  getTelemetry,
  setTelemetry,
  getTelemetryFor,
};
