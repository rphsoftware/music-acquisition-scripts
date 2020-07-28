import * as express from 'express';
import fetch from 'node-fetch';
import * as cors from 'cors';
import * as querystring from 'querystring';
import * as cookieParser from 'cookie-parser';

const client_id = ''; // Your client id
const client_secret = ''; // Your secret
const redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

function generateRandomString(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const stateKey = "spotify_auth_state";
const app = express();

console.log(__dirname);

app
   .use(cors())
   .use(cookieParser());

app.get("/login", function(req, res) {
    let state = generateRandomString(32);
    res.cookie(stateKey, state);

    const scope = [
        "user-read-email",
        "user-library-read",
        "user-top-read",
        "user-read-private",
        "playlist-read-private",
        "playlist-read-collaborative",
        "user-read-recently-played"
    ].join(" ");
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        })
    );
});

app.get('/callback', async function(req, res) {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.end("bad");
    } else {
        res.clearCookie(stateKey);
        const params = new URLSearchParams();
        params.append('code', code as string);
        params.append('redirect_uri', redirect_uri);
        params.append('grant_type', 'authorization_code');
        let resp = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            body: params
        });
        let token = await resp.json();
        console.log(token);

        res.end("Got token, thanks!");
    }
});

app.listen(8888);
