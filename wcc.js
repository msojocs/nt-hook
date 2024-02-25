const { spawn, spawnSync, exec, execSync } = require("child_process");
const fs = require('fs');
(async () => {
    console.log('start')
    const hookTask = spawn('python', ['-u', ".\\wcc.py"], {
        
    })
    // const f = fs.openSync('output.log', 'w')
    hookTask.stdout.on('data', (d) => {
        process.stdout.write(d)
        // fs.writeSync(f, d.toString())
    })
    // console.log('end')
    hookTask.on('exit', () => {
        // fs.closeSync(f)
    })
    
})()