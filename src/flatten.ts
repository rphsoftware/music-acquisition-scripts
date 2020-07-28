import * as fs from 'fs';

(async function() {
    let playlists = fs.readdirSync(__dirname + "/output");


    for (let plid in playlists) {
        let playlist = playlists[plid];
        let metadata = JSON.parse(fs.readFileSync(__dirname + "/playlists/" + playlist + ".json", "utf-8"));

        fs.mkdirSync(__dirname + "/flattened/" + metadata.name);

        let artists = fs.readdirSync(__dirname + "/output/" + playlist);
        let songs = new Map();

        for (let aid in artists) {
            let artist = artists[aid];

            // Read the artist's albums
            let artistAlbums = fs.readdirSync(__dirname + "/output/" + playlist + "/" + artist);
            for (let alid in artistAlbums) {
                let album = artistAlbums[alid];

                // Read the album
                let albumSongs = fs.readdirSync(__dirname + "/output/" + playlist + "/" + artist + "/" + album);
                // Special case for discs
                if (albumSongs[0].startsWith("Disc") && !(albumSongs[0].split(".").length > 1)) {
                    for (let discid in albumSongs) {
                        let discSongs = fs.readdirSync(__dirname + "/output/" + playlist + "/" + artist + "/" + album + "/" + albumSongs[discid]);
                        for (let sid in discSongs) {
                            let song = discSongs[sid];
                            if (song.endsWith(".mp3")) {
                                let songAr = song.split(".") as [string];
                                songs.set(artist + " - " + songAr.join("."),
                                    __dirname + "/output/" + playlist + "/" + artist + "/" + album + "/" + albumSongs[discid] + "/" + song
                                );
                            }
                        }
                    }
                } else {
                    // Normal songs
                    for (let sid in albumSongs) {
                        let song: string = albumSongs[sid];
                        if (song.endsWith(".mp3")) {
                            let songAr = song.split(".") as [string];
                            songs.set(artist + " - " + songAr.join("."),
                                __dirname + "/output/" + playlist + "/" + artist + "/" + album + "/" + song
                            );
                        }
                    }
                }
            }
        }

        let done = 0;
        let todo = songs.size;
        songs.forEach(function(v, k) {
            let content = fs.readFileSync(v);
            fs.writeFileSync(__dirname + "/flattened/" + metadata.name + "/" + k, content);

            done++;
            console.log(`${done} / ${todo}`);
        });
    }
})();