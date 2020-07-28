import fetch from 'node-fetch';

const token = "Bearer ";
const playlist = "";
const albums = [

];

(async function() {
    console.log("Spamming a playlist");

    let resp = await (await fetch("https://api.spotify.com/v1/albums?ids=" + albums.join(","), {
        headers: {
            'Authorization': token
        }
    })).json();

    let tracks = [];

    for (let i = 0; i < resp.albums.length; i++) {
        for (let j = 0; j < resp.albums[i].tracks.items.length; j++) {
            tracks.push(resp.albums[i].tracks.items[j].id);
        }
    }

    while(tracks.length > 0) {
        let z = tracks.slice(0, 20);
        z = z.map(u => `spotify:track:${u}`);

        let r = await fetch("https://api.spotify.com/v1/playlists/" + playlist + "/tracks?uris=" + z.join(","), {
            headers: {
                'Authorization': token
            },
            method: "POST"
        });

        for (let i = 0; i < 20; i++) {
            tracks.shift();
        }
        console.log(tracks.length);
        console.log(await r.json());
    }
})();

