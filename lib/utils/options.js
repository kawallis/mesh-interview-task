require('dotenv').config()

function options(url) {
    let newUrl = url + `?access_token=${process.env.GITHUB_TOKEN}`
    return {
        uri: newUrl,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true 
    };
}

module.exports = options;