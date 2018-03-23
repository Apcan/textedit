
const fs = require('fs'), path = require('path');
const readline = require('readline');
const os = require('os');

/**
 * 
 * @param {String} inpath 输入文件路径 encode:utf-8
 * @param {String} outpath 可选输出文件路径(若为空则覆盖)
 * @param {Array} data flag : text文件中写入 to-insert<flag>作为标记,type : line表示下一行添加，replace表示替换原位
 * exp:[{flag:'',text:'',type:'line|replace'},{flag:'',text:'',type:'line|replace'}] 
 */

const insert = (inpath, outpath, data) => new Promise((resolve, reject) => {
    inpath = path.resolve(inpath);
    let replace = false;
    os.tmpdir()
    if (!data) {
        data = outpath;
        outpath = os.tmpdir() + path.sep + new Date().getTime() + '_' + path.basename(inpath);
        replace = true;
    } else {
        outpath = path.resolve(outpath)
    }
    let new_data = {}
    data.forEach((_obj) => {
        new_data[_obj.flag] = _obj
    })
    let io = fs.createReadStream(inpath, { encoding: 'utf-8' });
    let ip = fs.createWriteStream(outpath, { encoding: 'utf-8' });
    let reading = readline.createInterface({
        input: io
    });
    ip.on('open', () => {
        var linecount = 0
        reading.on('line', (line) => {
            let flag_line = line.match(/to-insert<(.*?)>/);
            if (flag_line) {
                let flag = flag_line[1];
                let content = new_data[flag];
                if (!content.type || (content.type === 'line')) {
                    ip.write(`${line}\n`)
                }
                ip.write(`${content.text}\n`)
            } else
                ip.write(`${line}\n`)
        });
        reading.on('close', () => {
            ip.end();
        });
    })
    ip.on('error', (err) => { reject(err) });
    ip.on('finish', () => {
        if (replace) {
            fs.unlinkSync(inpath);
            fs.copyFileSync(outpath, inpath)
            outpath = inpath
        }
        resolve(outpath)
    });

})

module.exports = insert;