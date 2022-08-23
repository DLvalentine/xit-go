'use strict';

const xitPatterns = {
    group: /^([a-zA-Z0-9].*|\[(?!x\])[a-zA-Z0-9].*)/gm
};

// todo - when done delete tester?
// todo jsdoc when done -> turn xit-string into JSON object
// todo - when done, make export-default
/*export default*/ function parse(xitString) {
    xitString.split('\n').forEach((line) => {
        if(line.match(xitPatterns.group)) {
            console.log(`matched: ${line}`);
        }
    });
};

// TODO/NOTE DEBUG IIFE -  PLEASE REMOVE WHEN DONE
(() => {
    const fs = require('fs');
    parse(fs.readFileSync('C:\\Users\\david\\Documents\\Prog\\xit-go\\lib\\tester.xit').toString());
})();