const cache = require('../gather/cache');

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

module.exports = {
  getTelemetry,
  setTelemetry,
};
