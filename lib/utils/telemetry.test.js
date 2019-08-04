const { getTelemetry, setTelemetry } = require('./telemetry');

describe('get/set Telemetry', () => {
  test('can get the set telemetry', () => {
    let fakeTelemetry = {
      a: 1,
      b: 2,
    };

    setTelemetry(fakeTelemetry);

    let telemetry = getTelemetry();

    expect(Object.keys(telemetry)).toEqual(Object.keys(fakeTelemetry));
    expect(Object.values(telemetry)).toEqual(Object.values(fakeTelemetry));
  });
});
