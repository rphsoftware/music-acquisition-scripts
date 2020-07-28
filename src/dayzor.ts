import fetch from 'node-fetch';
import * as fs from 'fs';
import * as querystring from 'querystring';

const sleep = timeout => new Promise(resolve => setTimeout(resolve, timeout));

function buildQuery(info) : string {
    return `track:"${info.name}" artist:"${info.artist[0]}"`;
}

(async function 𒂙() {
    let files = fs.readdirSync(__dirname + "/playlists");

    for (let playlist = 0; playlist < files.length; playlist++) {
        let successful = 0;
        let failed = 0;
        let failedList = [];
        let urls = "";
        let f = files[playlist];
        let info = JSON.parse(fs.readFileSync(__dirname + "/playlists/" + f, {encoding:"utf-8"}));

        for (let i = 0; i < info.tracks.length; i++) {
            let qs = querystring.stringify({
                "q": buildQuery(info.tracks[i])
            });
            let resp = await (await fetch("https://api.deezer.com/search?" + qs)).json();

            if (resp.total > 0) {
                successful++;
                urls = `${urls}${resp.data[0].link}\n`;
            } else {
                failed++;
                failedList.push(info.tracks[i])
            }
            if (i % 10 == 0) {
                console.log(`${i} / ${info.tracks.length}`)
            }
            await sleep(100);
        }

        console.log(`${f} | Success: ${successful} | Failure: ${failed}`);
        fs.writeFileSync(__dirname + "/lists/" + f.split(".")[0] + ".txt", urls);
        fs.writeFileSync(__dirname + "/lists_failedsongs/" + f, JSON.stringify(failedList, null, 2));
    }
})();
