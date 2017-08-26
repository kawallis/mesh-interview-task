export default function options(url) {
    return {
        uri: url,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true 
    };
}

