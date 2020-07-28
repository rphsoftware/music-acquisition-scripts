import * as fs from 'fs';
import * as cp from 'child_process';

(async function 𒂙() {
    const f = fs.readdirSync(__dirname + "/lists");

    for (let i = 0; i < f.length; i++) {
        let data = fs.readFileSync(__dirname + "/lists/" + f[i], "utf-8").split("\n");

        try {
            fs.mkdirSync(__dirname + "/output")
            fs.mkdirSync(__dirname + "/output/" + f[i].split(".")[0]);
        }catch(e){}
        for (let j = 0; j < (data.length - 1); j++) {
            cp.spawnSync(__dirname + "/SMLoadr-linux-x64", [
                "-p",
                __dirname + "/output/" + f[i].split(".")[0],
                "-q",
                "MP3_320",
                "-u",
                data[j]
            ]);

            console.log(`${f[i]} - ${j} / ${data.length}`);

            try { fs.unlinkSync(__dirname + "/downloadedSuccessfully.txt"); } catch(e){ }
        }
    }
})();