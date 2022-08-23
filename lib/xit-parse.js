'use strict';

// NOTE / todo -> hard part will be determining modifiers, like tags or priority.
//                thinking we first determine the component by LINE then by tokens (e.g. -> determine line is an open item first before determining if it has priority markers, tags, etc.)
const xitPatterns = {
    group: /^([a-zA-Z0-9].*|\[(?!x\])[a-zA-Z0-9].*)/gm,
    openItem: '', //todo
    checkedItem: '', //todo
    ongoingItem: '', //todo
    obsoleteItem: '', //todo
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