const fs = require('fs');

const COUNT = 5000;
let output = '';

function pad(num, size) {
    let s = "000000000" + num;
    return s.substr(s.length - size);
}

// Simple checksum calculation for TLE
function checksum(line) {
    let sum = 0;
    for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c >= '0' && c <= '9') sum += parseInt(c);
        else if (c === '-') sum += 1;
    }
    return sum % 10;
}

for (let i = 0; i < COUNT; i++) {
    const id = 70000 + i;
    const year = 19 + Math.floor(Math.random() * 7); // 19 to 25
    const launchNum = pad(Math.floor(Math.random() * 100) + 1, 3);
    
    // Inclination: Starlink shells are mainly 53, 70, 97.6
    const incOptions = [53.0, 53.2, 70.0, 97.6, 43.0];
    const inc = incOptions[Math.floor(Math.random() * incOptions.length)];
    
    const raan = Math.random() * 360;
    const ecc = 0.0001; // Circular
    const argPerigee = Math.random() * 360;
    const meanAnomaly = Math.random() * 360;
    const meanMotion = 15.06; // ~550km
    
    // Construct Line 1
    // 1 NNNNNU YYLLLA   YYDDD.DDDDDDDD  .00000000  00000-0  00000-0 0  9999
    let line1Raw = `1 ${id}U ${year}${launchNum}A   25001.00000000  .00000000  00000-0  00000-0 0  999`;
    line1Raw += checksum(line1Raw);
    
    // Construct Line 2
    // 2 NNNNN  II.IIII NNN.NNNN EEEEEEE OOO.OOOO MMM.MMMM NN.NNNNNNNNRRRRR
    const sInc = inc.toFixed(4).padStart(8, ' ');
    const sRaan = raan.toFixed(4).padStart(8, ' ');
    const sEcc = "0001000";
    const sArg = argPerigee.toFixed(4).padStart(8, ' ');
    const sMean = meanAnomaly.toFixed(4).padStart(8, ' ');
    const sMotion = meanMotion.toFixed(8).padStart(11, ' ');
    const rev = "00001";
    
    let line2Raw = `2 ${id} ${sInc} ${sRaan} ${sEcc} ${sArg} ${sMean} ${sMotion}${rev}`;
    line2Raw += checksum(line2Raw);
    
    output += `STARLINK-${id}\n${line1Raw}\n${line2Raw}\n`;
}

fs.writeFileSync('public/starlink.tle', output);
console.log(`Generated ${COUNT} mock satellites in public/starlink.tle`);
