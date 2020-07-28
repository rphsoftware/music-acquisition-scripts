import fetch from 'node-fetch';
import * as fs from 'fs';
const token = "Bearer ";

const playlists = new Map();

(async function() {
    console.log("Fetching your playlists...");

    let resp = await (await fetch("https://api.spotify.com/v1/me/playlists", {
        headers: {
            'Authorization': token
        }
    })).json();


    for (let i = 0; i < resp['items'].length; i++) {
        let item = resp['items'][i];

        let playlistObject = {
            name: item.name,
            tracks: []
        };
        let url = item.href;

        while(true) {
            let songs = await (await fetch(url, {
                headers: {
                    'Authorization': token
                }
            })).json();

            if (songs.type == "playlist") {
                songs = songs.tracks;
            }

            for (let songId = 0; songId < songs.items.length; songId++) {
                let sngObj = {
                    name: songs.items[songId].track.name,
                    album: songs.items[songId].track.album.name,
                    artist: []
                };

                for (let artistId = 0; artistId < songs.items[songId].track.artists.length; artistId++) {
                    sngObj.artist.push(songs.items[songId].track.artists[artistId].name);
                }

                playlistObject.tracks.push(sngObj);
            }

            if (songs.next === null) break;
            else url = songs.next;
        }

        playlists.set(resp['items'][i].id, playlistObject);
    }

    playlists.forEach(function(v, k) {
        fs.writeFileSync(__dirname + "/playlists/" + k + ".json", JSON.stringify(v, null, 2));
    })
})();

