import fetch from 'node-fetch';
import * as fs from 'fs';
const token = "Bearer "'

(async function() {
    console.log("Fetching your saves...");

    let url = "https://api.spotify.com/v1/me/tracks?limit=50";
    let playlistObject = {
        name: "Saved songs",
        tracks: []
    };
    while(true) {
        console.log(url);
        let resp = await (await fetch(url, {
            headers: {
                'Authorization': token
            }
        })).json();

        for (let i = 0; i < resp.items.length; i++) {
            let songObject = {
                name: resp.items[i].track.name,
                album: resp.items[i].track.album.name,
                artist: []
            };

            for (let j = 0; j < resp.items[i].track.artists.length; j++) {
                songObject.artist.push(resp.items[i].track.artists[j].name);
            }

            playlistObject.tracks.push(songObject);
        }

        if (resp.next !== null) url = resp.next;
        else break;
    }

    fs.writeFileSync(__dirname + "/playlists/saved.json", JSON.stringify(playlistObject, null, 2));
})();
