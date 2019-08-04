const cache = require('../gather/cache');

async function getTelemetry() {
  let telemetryExists = cache.has('telemetry');

  if (!telemetryExists) {
    return {};
  }

  let telemetryData = cache.get('telemetry');
  let telemetry = JSON.parse(telemetryData).value;

  return telemetry;
}

module.exports = {
  getTelemetry,
};
