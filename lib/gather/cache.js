const Cache = require('sync-disk-cache');
const getRepoInfo = require('git-repo-info');
const crypto = require('crypto');

const gitInfo = getRepoInfo();

const cwdHash = crypto
  .createHash('sha256')
  .update(process.cwd(), 'utf8')
  .digest('hex');

const cachePath = `ember-codemods-telemetry-helpers-${gitInfo.sha}-${cwdHash}`;

const cache = new Cache(cachePath);

module.exports = cache;
