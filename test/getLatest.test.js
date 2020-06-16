// @format
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function getLatest() {
  const url = 'http://localhost:7100/version/latest?platform=dingtalk';
  const shellCmd = `curl "${url}"`;
  console.log(shellCmd);
  const {stdout, stderr} = await exec(shellCmd);
  stdout && console.log(stdout);
  stderr && console.log(stderr);
  return stdout;
}

getLatest();
