// todo: jsdoc
'use strict';

// To be used when looking at *entire* line to determine type
const xitLineTypePatterns = {
    title: /^([a-zA-Z0-9].*|\[(?!x\])[a-zA-Z0-9].*)/gm,
    openItem: /^\[ \] .*/gm,
    checkedItem: /^\[x\] .*/gm,
    ongoingItem: /^\[@\] .*/gm,
    obsoleteItem: /^\[~\] .*/gm,
    itemDetails: /^([\t]+|[ ]{4}).*/gm,
};

// To be used when looking at line tokens to determine modifiers
// TODO/NOTE: certain rules need to be observed here, like priority must be before first word, that will need to be enforced later, not through the pattern
const xitLineModifierPatterns = {
    priority: /[.!]*/gm,
    dueDate: /-> ([0-9]{4}(-|\/){0,1}([qQwW]{0,1}[0-9]{1,2}){0,1})(-|\/){0,1}([0-9]{2}){0,1}/gm, // TODO/NOTE - this will match the pattern, but will need to be validated using JS date/time and some custom logic
    tag: /#[^ ]*/gm,
};

const TITLE_TYPE = 'title';

const ITEM_TYPE = 'item';
const ITEM_STATUS_OPEN = 'open';
const ITEM_STATUS_CHECKED = 'checked';
const ITEM_STATUS_ONGOING = 'ongoing';
const ITEM_STATUS_OBSOLETE = 'obsolete';

const ITEM_DETAILS_TYPE = 'details';

const PRIORITY_MOD_TYPE = 'priority';
const DUE_DATE_MOD_TYPE = 'due';
const TAG_MOD_TYPE = 'tag';

// todo jsdoc when done
function fileToObject(xitString) {
    const xitObject = {
        lines: []
    };

    // Used mostly to determine if current item is an item's details
    let prevItemType = null;

    // First, add lines to object by type. Throw error if not valid.
    xitString.split('\n').forEach((line, idx) => {
        // determine type -> todo - make function(s), DRY up?
        if (line.match(xitLineTypePatterns.title)) {
            xitObject.lines.push(
                {
                    type: TITLE_TYPE,
                    status: null,
                    content: line.replace(/[\n\r]*$/, ''),
                    modifiers: []
                }
            );
            prevItemType = TITLE_TYPE;
        } else if (line.match(xitLineTypePatterns.openItem)) {
            xitObject.lines.push(
                {
                    type: ITEM_TYPE,
                    status: ITEM_STATUS_OPEN,
                    content: line.replace(/[\n\r]*$/, ''),
                    modifiers: []
                }
            );
            prevItemType = ITEM_TYPE;
        } else if (line.match(xitLineTypePatterns.checkedItem)) {
            xitObject.lines.push(
                {
                    type: ITEM_TYPE,
                    status: ITEM_STATUS_CHECKED,
                    content: line.replace(/[\n\r]*$/, ''),
                    modifiers: []
                }
            );
            prevItemType = ITEM_TYPE;
        } else if (line.match(xitLineTypePatterns.ongoingItem)) {
            xitObject.lines.push(
                {
                    type: ITEM_TYPE,
                    status: ITEM_STATUS_ONGOING,
                    content: line.replace(/[\n\r]*$/, ''),
                    modifiers: []
                }
            );
            prevItemType = ITEM_TYPE;
        } else if (line.match(xitLineTypePatterns.obsoleteItem)) {
            xitObject.lines.push(
                {
                    type: ITEM_TYPE,
                    status: ITEM_STATUS_OBSOLETE,
                    content: line.replace(/[\n\r]*$/, ''),
                    modifiers: []
                }
            );
            prevItemType = ITEM_TYPE;
        } else if ((prevItemType === ITEM_TYPE || prevItemType === ITEM_DETAILS_TYPE) && line.match(xitLineTypePatterns.itemDetails)) {
            xitObject.lines.push(
                {
                    type: ITEM_DETAILS_TYPE,
                    status: null,
                    content: line.replace(/[\n\r]*$/, ''),
                    modifiers: []
                }
            );
            prevItemType = ITEM_DETAILS_TYPE;
        } else if (line.match(/^[\n\r]*/gm)) {
            prevItemType = null;
        } else {
            throw `ParserError: One or more lines of provided Xit are invalid starting on L${idx} with content: ${line}`;
        }

    });

    // note - debug
    console.log(xitObject);
};

// todo jsdoc when done
function objectToFile(xitObject) {
    // todo
};

// todo - also export relevant constants
module.exports = {
    fileToObject,
    objectToFile
};

// TODO/NOTE DEBUG IIFE -  PLEASE REMOVE WHEN DONE
(() => {
    const fs = require('fs');
    fileToObject(fs.readFileSync('C:\\Users\\david\\Documents\\Prog\\xit-go\\lib\\tester.xit').toString());
})();