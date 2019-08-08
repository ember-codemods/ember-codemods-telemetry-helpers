const cache = require('../gather/cache');
const { getModulePathFor } = require('./get-module-path-for');

const CACHE_KEY = 'telemetry';

function setTelemetry(newTelemetry) {
  let data = JSON.stringify(newTelemetry);

  cache.set(CACHE_KEY, data);
}

function getTelemetry() {
  let telemetryExists = cache.has(CACHE_KEY);

  if (!telemetryExists) {
    return {};
  }

  let telemetryData = cache.get(CACHE_KEY).value;
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
  let moduleKey = modulePath.replace('templates/components/', 'components/');
  let data = getTelemetry()[moduleKey];

  return data;
}

module.exports = {
  getTelemetry,
  setTelemetry,
  getTelemetryFor,
};
