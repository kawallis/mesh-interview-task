const Router = require('express').Router;
const router = Router();
var rp = require('request-promise');

function options(url) {
    return {
        uri: url,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true 
    };
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
        let repositories = repos.filter(repo => {
            Promise.all([
                rp(options(`https://api.github.com/repos/kawallis/${repo.name}/commits`)),
                rp(options(`https://api.github.com/repos/kawallis/${repo.name}/pulls`))
            ])
            .then(moreInfo => {
                let commits = moreInfo[0].length;
                let pulls = moreInfo[1].length;  
                return {
                    name: repo.name,
                    url: repo.html_url,
                    commitCount: commits,
                    pullRequestCount: pulls
                } 
            })
            .catch(err => console.log)
        }, [])

        console.log(repositories);
        let payload = {
            user: {
                githubHandle: user.login,
                githubURL: user.url,
                avatarURL: user.avatar_url,
                email: 'wallaccm@icloud.com',
                followerCount: user.followers,
                repositories: repositories
            }
        }
        return res.send(payload)
    })
    .catch(err => console.log)
  });

module.exports = router;