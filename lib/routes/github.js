const Router = require('express').Router;
const router = Router();
const rp = require('request-promise');
const options = require('../utils/options');

function getPullsAndCommits(repo) {
    return Promise.all([
        rp(options(`https://api.github.com/repos/kawallis/${repo.name}/pulls`)),
        rp(options(`https://api.github.com/repos/kawallis/${repo.name}/commits`))
    ])
    .then(result => {
        return { 
            name: repo.name,
            url: repo.html_url,
            commitCount: result[1].length,
            pullRequestCount: result[0].length
        }
    });
}

router

  .get('/', (req, res, next) => {
    Promise.all([
        rp(options('https://api.github.com/users/kawallis')),
        rp(options('https://api.github.com/users/kawallis/repos'))
    ])
    .then(info => {
        let user = info[0];
        let repos = info[1];
        let newRepos = repos.map(repo => getPullsAndCommits(repo))
        Promise.all(newRepos)
        .then(data => {
            let payload = {
                user: {
                    githubHandle: user.login,
                    githubURL: user.url,
                    avatarURL: user.avatar_url,
                    email: 'wallaccm@icloud.com',
                    followerCount: user.followers,
                    repositories: data
                }
            }
            return res.send(payload)
        });
    })
    .catch(err => console.log)
  });

module.exports = router;