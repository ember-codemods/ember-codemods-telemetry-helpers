# ember-codemods-telemetry-helpers

[![Build Status](https://travis-ci.com/ember-codemods/ember-codemods-telemetry-helpers.svg?branch=master)](https://travis-ci.com/ember-codemods/ember-codemods-telemetry-helpers) [![npm](https://img.shields.io/npm/v/ember-codemods-telemetry-helpers.svg?label=npm)](https://www.npmjs.com/package/ember-codemods-temetry-helpers)


Telemetry helpers runs the app, grabs basic info about all of the modules at runtime.
This allows the codemod to know the names of every helper, component, route, controller, etc in the app without guessing / relying on static analysis.
They basically help you to create "runtime assisted codemods".

## Goal
The goal of the project though was to enable each codemod to manage its own type of data gathering
and that the gather-telemetry-helpers package provides the harness to run that custom gathering function

## Usage

Assuming you are authoring a codemod with [codemod-cli](https://github.com/rwjblue/codemod-cli), `ember-codemods-telemetry-helpers` allows you freedom to assign your own "telemetry gathering" function while provide one of its own out of the box (opt-in).

```javascript
#!/usr/bin/env node
'use strict';

const { gatherTelemetryForUrl } = require('ember-codemods-telemetry-helpers');
const appLocation = process.argv[2];
const args = process.argv.slice(3);

// Gather only helpers
function findHelpers(possibleEmberObject) {
  if (
    possibleEmberObject &&
    possibleEmberObject.default &&
    possibleEmberObject.default.isHelperFactory
  ) {
    return true;
  }
}


(async () => {
  await gatherTelemetryForUrl(appLocation, findHelpers);

  require('codemod-cli').runTransform(__dirname, 'my-cool-transform', args, 'hbs');
})();
```

All invocations of `gatherTelemetryForUrl` internally returns an object enumerated with properties named after all possible entries within `window.require.entries`.  The values of each property is the value returned from within the gathering function.  Usuing the example above, the output might be (for example):

```javascript
{
  'ember-inflector/lib/helpers/pluralize': true,
  'ember-inflector/lib/helpers/singularize': true,
  'input/helpers/app-version': true,
  'input/helpers/pluralize': true,
  'input/helpers/singularize': true,
}

```
## Contributing

### Installation

* clone the repo
* change into the repo directory
* `yarn`

### Running tests

* `yarn test`

## More info

See "Gathering runtime data" section of
https://github.com/ember-codemods/ember-native-class-codemod#gathering-runtime-data for some additonal info


This project was extracted from (ember-native-class-codemod)(https://github.com/ember-codemods/ember-native-class-codemod).
That codemod uses (puppeteer)(https://github.com/GoogleChrome/puppeteer) (via this lib) to visit the Ember app and gather telemetry necessary to convert to native classes.

The idea for the extraction was to put the harness in this package
(extracted from the native class codemod), but have the actual "telemetry gathering"
live in each individual codemod project because the things that they need are quite different
for example, for [implicit this codemod](https://github.com/ember-codemods/ember-no-implicit-this-codemod) and
[angle brackets codemod](https://github.com/ember-codemods/ember-angle-brackets-codemod) all we need to know is an array of the helpers and components in the app
but for [native class codemod](https://github.com/ember-codemods/ember-native-class-codemod) it needs much more info (names and types of methods, properties, etc on each default export)
