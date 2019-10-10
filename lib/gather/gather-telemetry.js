const puppeteer = require('puppeteer');
const { setTelemetry } = require('../utils/telemetry');

const DEFAULT_PUPPETEER_ARGS = { ignoreHTTPSErrors: true };

module.exports = async function gatherTelemetry(url, gatherFn, puppeteerArgs = {}) {
  Object.assign(puppeteerArgs, DEFAULT_PUPPETEER_ARGS);

  const browser = await puppeteer.launch(puppeteerArgs);
  const page = await browser.newPage();

  await page.goto(url);

  await page.exposeFunction('logErrorInNodeProcess', message => {
    console.error(message); // eslint-disable-line no-console
  });

  await page.exposeFunction('gatherFn', gatherFn);

  const telemetry = await page.evaluate(() => {
    const SKIPPED_MODULES = ['fetch/ajax'];

    /* globals window,*/
    let telemetry = {};

    const modules = Object.keys(window.require.entries);

    for (let modulePath of modules) {
      if (SKIPPED_MODULES.includes(modulePath)) {
        continue;
      }
      if (window.gatherFn && typeof window.gatherFn === 'function') {
        try {
          let module = require(modulePath);

          if (module && module.default && module.default.proto) {
            let defaultProto = module.default.proto();

            telemetry[modulePath] = window.gatherFn(defaultProto);
          }
        } catch (error) {
          // log the error, but continue
          window.logErrorInNodeProcess(`error evaluating \`${modulePath}\`: ${error.message}`);
        }
      }
    }
    return telemetry;
  });

  setTelemetry(telemetry);
  await browser.close();
};
