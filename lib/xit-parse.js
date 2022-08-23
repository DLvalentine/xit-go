'use strict';

// To be used when looking at *entire* line to determine type
const xitLineTypePatterns = {
    title: /^([a-zA-Z0-9].*|\[(?!x\])[a-zA-Z0-9].*)/gm,
    openItem: /^\[ \] .*/gm,
    checkedItem: /^\[x\] .*/gm,
    ongoingItem: /^\[@\] .*/gm,
    obsoleteItem: /^\[~\] .*/gm,
};

// To be used when looking at line tokens to determine modifiers
// NOTE: certain rules need to be observed here, like priority must be before first word
const xitLineModifierPatterns = {
    priority: /[.!]*/gm,
    dueDate: /-> ([0-9]{4}(-|\/){0,1}([qQwW]{0,1}[0-9]{1,2}){0,1})(-|\/){0,1}([0-9]{2}){0,1}/gm, // TODO/NOTE - this will match the pattern, but will need to be validated using JS date/time and some custom logic
    tag: /#[^ ]*/gm,
};

const TITLE_TYPE = 'title';
const ITEM_TYPE = 'item';
const PRIORITY_MOD_TYPE = 'priority';
const DUE_DATE_MOD_TYPE = 'due';
const TAG_MOD_TYPE = 'tag';

const ITEM_STATUS_OPEN = 'open';
const ITEM_STATUS_CHECKED = 'checked';
const ITEM_STATUS_ONGOING = 'ongoing';
const ITEM_STATUS_OBSOLETE = 'obsolete';

// todo - when done delete tester?
// todo jsdoc when done -> turn xit-string into JSON object
// todo - when done, make export-default
/*export default*/ function parse(xitString) {
};

// TODO/NOTE DEBUG IIFE -  PLEASE REMOVE WHEN DONE
(() => {
    const fs = require('fs');
    parse(fs.readFileSync('C:\\Users\\david\\Documents\\Prog\\xit-go\\lib\\tester.xit').toString());
})();