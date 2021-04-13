# Changelog

## v2.1.0 (2021-04-13)

#### :rocket: Enhancement
* [#40](https://github.com/ember-codemods/ember-codemods-telemetry-helpers/pull/40) Support add-on dummy app files ([@xg-wang](https://github.com/xg-wang))

#### :house: Internal
* [#41](https://github.com/ember-codemods/ember-codemods-telemetry-helpers/pull/41) Add basic GitHub Actions setup ([@rwjblue](https://github.com/rwjblue))

#### Committers: 2
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Thomas Wang ([@xg-wang](https://github.com/xg-wang))


## v2.0.0 (2020-11-20)

#### :boom: Breaking Change
* [#33](https://github.com/ember-codemods/ember-codemods-telemetry-helpers/pull/33) Drop Node < 10 ([@rjschie](https://github.com/rjschie))

#### :bug: Bug Fix
* [#35](https://github.com/ember-codemods/ember-codemods-telemetry-helpers/pull/35) Update `DEFAULT_PUPPETEER_ARGS` to launch Chrome with the `--no-sandbox` argument ([@shivani2692](https://github.com/shivani2692))

#### Committers: 2
- Ryan Schie ([@rjschie](https://github.com/rjschie))
- [@shivani2692](https://github.com/shivani2692)


## v1.2.1 (2020-04-24)

#### :bug: Bug Fix
* [#30](https://github.com/ember-codemods/ember-codemods-telemetry-helpers/pull/30) Ensure `setTelemetryWithKey` is exported properly. ([@suchitadoshi1987](https://github.com/suchitadoshi1987))

#### Committers: 1
- Suchita Doshi ([@suchitadoshi1987](https://github.com/suchitadoshi1987))

## v1.2.0 (2020-04-24)

#### :rocket: Enhancement
* [#28](https://github.com/ember-codemods/ember-codemods-telemetry-helpers/pull/28) Add single telemetry support ([@suchitadoshi1987](https://github.com/suchitadoshi1987))
#### :bug: Bug Fix
* [#27](https://github.com/ember-codemods/ember-codemods-telemetry-helpers/pull/27) Fix colon character in cwd on Windows ([@sinankeskin](https://github.com/sinankeskin))


#### Committers: 2
- Sinan Keskin ([@sinankeskin](https://github.com/sinankeskin))
- Suchita Doshi ([@suchitadoshi1987](https://github.com/suchitadoshi1987))

## v1.1.0 (2019-11-19)

#### :bug: Bug Fix
* [#25](https://github.com/ember-codemods/ember-codemods-telemetry-helpers/pull/25) Enumerate Component templates. ([@tylerturdenpants](https://github.com/tylerturdenpants))

#### :memo: Documentation
* [#24](https://github.com/ember-codemods/ember-codemods-telemetry-helpers/pull/24) Fix link in README.md ([@ursm](https://github.com/ursm))

#### Committers: 2
- Keita Urashima ([@ursm](https://github.com/ursm))
- Ryan Mark ([@tylerturdenpants](https://github.com/tylerturdenpants))

## v1.0.1 (2019-10-28)

#### :bug: Bug Fix
* [#22](https://github.com/ember-codemods/ember-codemods-telemetry-helpers/pull/22) `analyzeEmberObject()` exits too early not allowing to enumerate `helpers` ([@tylerturdenpants](https://github.com/tylerturdenpants))

#### Committers: 1
- Ryan Mark ([@tylerturdenpants](https://github.com/tylerturdenpants))

## v1.0.0 (2019-10-25)

#### :boom: Breaking Change
* [#14](https://github.com/ember-codemods/ember-codemods-telemetry-helpers/pull/14) Require consumer to specify telemetry gathering implementation. ([@tylerturdenpants](https://github.com/tylerturdenpants))

#### :bug: Bug Fix
* [#12](https://github.com/ember-codemods/ember-codemods-telemetry-helpers/pull/12) fix gathering helpers ([@tylerturdenpants](https://github.com/tylerturdenpants))
* [#20](https://github.com/ember-codemods/ember-codemods-telemetry-helpers/pull/20) Support referenced functions from within the gather function ([@tylerturdenpants](https://github.com/tylerturdenpants))
* [#10](https://github.com/ember-codemods/ember-codemods-telemetry-helpers/pull/10) feat: gather-telemetry now takes optional puppeteerArgs Closes [#8](https://github.com/ember-codemods/ember-codemods-telemetry-helpers/issues/8) ([@scottkidder](https://github.com/scottkidder))
* [#9](https://github.com/ember-codemods/ember-codemods-telemetry-helpers/pull/9) Fix `Cannot read property '1' of undefined` exception ([@simonihmig](https://github.com/simonihmig))

#### :memo: Documentation
* [#18](https://github.com/ember-codemods/ember-codemods-telemetry-helpers/pull/18) Describe 0.6.0 breaking changes in README. ([@tylerturdenpants](https://github.com/tylerturdenpants))
* [#17](https://github.com/ember-codemods/ember-codemods-telemetry-helpers/pull/17) update readme ([@tylerturdenpants](https://github.com/tylerturdenpants))
* [#15](https://github.com/ember-codemods/ember-codemods-telemetry-helpers/pull/15) [CHORE] Add project description and goals to readme ([@rajasegar](https://github.com/rajasegar))

#### Committers: 4
- Rajasegar Chandran ([@rajasegar](https://github.com/rajasegar))
- Ryan Mark ([@tylerturdenpants](https://github.com/tylerturdenpants))
- Scott Kidder ([@scottkidder](https://github.com/scottkidder))
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))

* Update gather-telemetry.js (#7) (5125860)
* Merge pull request #6 from ember-codemods/add-badges (96bcbd0)
* add badges to readme (1a1ed86)

* Support retrieving telemetry data for controllers (#5) (6484334)

Must provide GITHUB_AUTH

Must provide GITHUB_AUTH

