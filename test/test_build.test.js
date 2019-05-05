// @format
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function getCommitMessage() {
  const {stdout} = await exec('echo $(git log -1 --pretty="%B") | tr -d "\n"');
  return stdout;
}

async function getAuthor() {
  const {stdout} = await exec(
    'echo $(git log -1 --pretty="%an <%ae>") | tr -d "\n"',
  );
  return stdout;
}

async function getHash() {
  const {stdout} = await exec('echo $(git log -1 --pretty="%H") | tr -d "\n"');
  return stdout;
}

async function getPostBody() {
  const content = await getCommitMessage();
  const creator = await getAuthor();
  const version = await getHash();
  const body = {
    content,
    creator,
    product: 'dingtalk',
    version,
  };
  let ret = '';
  for (const k in body) {
    value = encodeURIComponent(body[k]);
    ret += `&${k}=${value}`;
  }
  return ret.slice(1);
}

async function saveBuild() {
  const postBody = await getPostBody();
  const url = 'http://localhost:28225/savebuild';
  const shellCmd = `curl "${url}" -d "${postBody}"`;
  console.log(shellCmd);
  const {stdout, stderr} = await exec(shellCmd);
  stdout && console.log(stdout);
  stderr && console.log(stderr);
  return stdout;
}

saveBuild();
