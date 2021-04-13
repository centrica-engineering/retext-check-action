
const github = require('@actions/github');
const core = require('@actions/core');

import { getChangedFiles } from './helpers/github.js';
import retext from 'retext';
import vfile from 'to-vfile';
import spell from 'retext-spell';
import english from 'retext-english';
import contractions from 'retext-contractions';
import equality from 'retext-equality';
import readability from 'retext-readability';
import repeated from 'retext-repeated-words';
import indefiniteArticle from 'retext-indefinite-article';
import stringify from 'retext-stringify';
import dictionary from 'dictionary-en-gb';
import report from 'vfile-reporter';

const github_token = core.getInput('github_token');
const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
const pull_request = github.context.payload.pull_request;

if (!github_token) {
  core.warning('Github token was not set');
}

const octokit = github.getOctokit(github_token);

(async () => {
  const filesChanged = await getChangedFiles(octokit, repo, owner);

  filesChanged.forEach((PRFile) => {
    if (PRFile.endsWith('.md') || PRFile.endsWith('.markdown')) {
      retext()
        .use(english)
        .use(equality)
        .use(contractions)
        .use(readability, { age: 20 })
        .use(spell, { dictionary, normalizeApostrophes: false, max: 100 })
        .use(repeated)
        .use(indefiniteArticle)
        .use(stringify)
        .process(vfile.readSync(PRFile), (err, file) => {
          const body = report(err || file);
          console.error(body);

          octokit.issues.createComment({
            owner,
            repo,
            issue_number: pull_request.number,
            body
          });
        })
    }
  })
})();