const { getTelemetry, setTelemetry, setTelemetryWithKey, getTelemetryFor } = require('./telemetry');

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

describe('get/set Telemetry with keys', () => {
  test('can get the set telemetry with keys', () => {
    let fakeTelemetry = {
      a: 1,
      b: 2,
    };

    setTelemetryWithKey('fake-telemetry', fakeTelemetry);

    let telemetry = getTelemetry('fake-telemetry');

    expect(Object.keys(telemetry)).toEqual(Object.keys(fakeTelemetry));
    expect(Object.values(telemetry)).toEqual(Object.values(fakeTelemetry));
  });
});

describe('getTelemetryFor', () => {
  test('gets the data for the filePath', () => {
    let fakeTelemetry = { a: 1 };

    setTelemetry(fakeTelemetry);

    let value = getTelemetryFor('a');

    expect(value).toEqual(1);
  });

  describe('classic apps', () => {
    test('gets the data for the component filePath', () => {
      let fakeTelemetry = { 'test-app/components/test-component': 1 };

      setTelemetry(fakeTelemetry);

      let value = getTelemetryFor('test-app/templates/components/test-component');

      expect(value).toEqual(1);
    });

    test('gets the data for the controller filePath', () => {
      let fakeTelemetry = { 'test-app/controllers/application': 1 };

      setTelemetry(fakeTelemetry);

      let value = getTelemetryFor('test-app/templates/application');

      expect(value).toEqual(1);
    });
  });
});
