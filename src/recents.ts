import fetch from 'node-fetch';
import * as fs from 'fs';

const token = "Bearer ";
let dupes = new Set();

(async function() {
    console.log("Fetching recents");

    let resp = await (await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=50", {
        headers: {
            'Authorization': token
        }
    })).json();
    let playlistObject = {
        name: "Recently played",
        tracks: []
    };
    for (let i = 0; i < resp.items.length; i++) {
        let sngObj = {
            name: resp.items[i].track.name,
            album: resp.items[i].track.album.name,
            artist: []
        };

        for (let j = 0; j < resp.items[i].track.artists.length; j++) {
            sngObj.artist.push(resp.items[i].track.artists[j].name);
        }

        if (!dupes.has(resp.items[i].track.id)) {
            playlistObject.tracks.push(sngObj);
            dupes.add(resp.items[i].track.id);
        }
    }

    fs.writeFileSync(__dirname + "/recents.json", JSON.stringify(playlistObject, null, 2));
})();