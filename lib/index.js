const gatherTelemetryUrl = require('./gather/gather-telemetry');
const { getTelemetryFor, getModulePathFor } = require('./utils/get-telemetry-for');

module.exports = {
  gatherTelemetryUrl,
  getTelemetryFor,
  getModulePathFor,
};
