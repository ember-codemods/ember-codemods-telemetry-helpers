const execa = require('execa');
const path = require('path');

module.exports = async function startApp(appPath) {
  const classicAppDir = path.resolve(appPath);
  const execOpts = { cwd: classicAppDir, stderr: 'inherit' };
  console.log('installing deps');

  await execa('rm', ['-rf', 'node_modules'], execOpts);
  await execa('yarn', ['install'], execOpts);

  console.log('starting serve');
  const emberServe = execa('yarn', ['start'], execOpts);
  emberServe.stdout.pipe(process.stdout);

  await new Promise(resolve => {
    emberServe.stdout.on('data', data => {
      let dataAsStr = data.toString();
      if (dataAsStr.includes('Build successful')) {
        resolve();
      }
    });
  });

  return { emberServe };
};
