# ember-codemods-telemetry-helpers

[![Build Status](https://travis-ci.com/ember-codemods/ember-codemods-telemetry-helpers.svg?branch=master)](https://travis-ci.com/ember-codemods/ember-codemods-telemetry-helpers)

[![npm](https://img.shields.io/npm/v/ember-codemods-telemetry-helpers.svg?label=npm)](https://www.npmjs.com/package/ember-codemods-temetry-helpers)

Telemetry helpers runs the app, grabs basic info about all of the modules at runtime. 
This allows the codemod to know the names of every helper, component, route, controller, etc in the app without guessing / relying on static analysis.
They basically help you to create "runtime assisted codemods".

## Goal
The goal of the project though was to enable each codemod to manage its own type of data gathering
and that the gather-telemetry-helpers package provides the harness to run that custom gathering function

## More info

See "Gathering runtime data" section of 
https://github.com/ember-codemods/ember-native-class-codemod#gathering-runtime-data for some additonal info


This project was extracted from (ember-native-class-codemod)(https://github.com/ember-codemods/ember-native-class-codemod). 
That codemod uses (puppeteer)(https://github.com/GoogleChrome/puppeteer) (via this lib) to visit the Ember app and gather telemetry necessary to convert to native classes. 

The idea for the extraction was to put the harness in this package 
(extracted from the native class codemod), but have the actual "telemetry gathering" 
live in each individual codemod project because the things that they need are quite different
for example, for [implicit this codemod]() and [angle brackets codemod]() all we need to know is an array of the helpers and components in the app
but for native class codemod it needs much more info (names and types of methods, properties, etc on each default export)
