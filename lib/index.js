const gatherTelemetryForUrl = require('./gather/gather-telemetry');
const { getModulePathFor } = require('./utils/get-module-path-for');
const { getTelemetry, setTelemetry, getTelemetryFor } = require('./utils/telemetry');
const parseMeta = require('../lib/gather/local-gather');

module.exports = {
  getTelemetry,
  setTelemetry,
  gatherTelemetryForUrl,
  getTelemetryFor,
  getModulePathFor,
  parseMeta,
};
