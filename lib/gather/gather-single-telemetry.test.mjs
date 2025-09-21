const startApp = require('../../test/helpers/start-app');
const gatherSingleTelemetry = require('./gather-single-telemetry');
const { getTelemetry } = require('../utils/telemetry');
const APP_TIMEOUT = 100000;
const TELEMETRY_KEY = 'single-telemetry';

import { describe, beforeAll, test, afterAll, expect } from 'vitest';

function resolverWithoutArgs() {
  return { foo: 'bar' };
}

function resolverWithArgs(lookupNames) {
  if (lookupNames) {
    return lookupNames.map(item => {
      const lookupSplit = item.split(':');
      return { name: lookupSplit[1], type: lookupSplit[0] };
    });
  }
}

describe('Gather single telemetry', () => {
  let app;
  let localAppPath = './test/fixtures/classic-app';
  beforeAll(async () => {
    app = await startApp(localAppPath);
    console.log(`Spawned PID: ${app.emberServe.pid}`);
  }, APP_TIMEOUT);

  test('can determine base single telemetry case', async () => {
    await gatherSingleTelemetry(
      'http://localhost:4200',
      { telemetryKey: TELEMETRY_KEY },
      resolverWithoutArgs
    );
    let telemetry = getTelemetry(TELEMETRY_KEY);
    expect(telemetry).toEqual({
      foo: 'bar',
    });
  });

  test('can determine single telemetry with arguments passed', async () => {
    const lookupNames = ['component:foo', 'helper:bar'];
    await gatherSingleTelemetry(
      'http://localhost:4200',
      { telemetryKey: TELEMETRY_KEY },
      resolverWithArgs,
      lookupNames
    );
    let telemetry = getTelemetry(TELEMETRY_KEY);
    expect(telemetry).toEqual([
      { name: 'foo', type: 'component' },
      { name: 'bar', type: 'helper' },
    ]);
  });

  afterAll(async () => {
    console.log(`Killing PID: ${app.emberServe.pid}`);
    await app.emberServe.shutdown();
  }, APP_TIMEOUT);
});
