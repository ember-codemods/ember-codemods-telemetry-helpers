'use strict';

const { gatherTelemetryForUrl, analyzeEmberObject } = require('../lib');

gatherTelemetryForUrl(process.argv[2], analyzeEmberObject);
