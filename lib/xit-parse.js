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
const xitLineModifierPatterns = {
    priority: /^.*([!]|[.]*[!]){1,} .*/gm,
    dueDate: /-> ([0-9]{4}(-|\/){0,1}([qQwW]{0,1}[0-9]{1,2}){0,1})(-|\/){0,1}([0-9]{2}){0,1}/gm,
    tag: /#[^ ]{1,}/gm,
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

    // todo jsdoc, break out?
    const parseXitModifiers = (content) => {
        const modifiers = {
            hasPriority: false,
            due: null,
            tags: []
        };

        const hasPriority = content.match(xitLineModifierPatterns.priority);
        const due = content.match(xitLineModifierPatterns.dueDate);
        const tags = content.match(xitLineModifierPatterns.tag);

        if (hasPriority !== null && hasPriority.length)
            modifiers.hasPriority = true;

        if (due !== null && due.length)
            modifiers.due = due[0].split('-> ')[1];

        if (tags !== null && tags.length)
            modifiers.tags = tags;
       
        return modifiers;
    };

    // todo jsdoc, break out?
    const addXitObjectLine = (type, status, content) => {
        const trimmedContent = content.replace(/[\n\r]*$/, '');

        xitObject.lines.push(
            {
                type,
                status,
                content: trimmedContent,
                modifiers: type !== TITLE_TYPE ? parseXitModifiers(trimmedContent) : null
            }
        );
    };

    // Used mostly to determine if current item is an item's details
    let prevItemType = null;

    // First, add lines to object by type. Throw error if not valid.
    xitString.split('\n').forEach((line, idx) => {
        if (line.match(xitLineTypePatterns.title)) {
            addXitObjectLine(TITLE_TYPE, null, line)
            prevItemType = TITLE_TYPE;
        } else if (line.match(xitLineTypePatterns.openItem)) {
            addXitObjectLine(ITEM_TYPE, ITEM_STATUS_OPEN, line);
            prevItemType = ITEM_TYPE;
        } else if (line.match(xitLineTypePatterns.checkedItem)) {
            addXitObjectLine(ITEM_TYPE, ITEM_STATUS_CHECKED, line);
            prevItemType = ITEM_TYPE;
        } else if (line.match(xitLineTypePatterns.ongoingItem)) {
            addXitObjectLine(ITEM_TYPE, ITEM_STATUS_ONGOING, line);
            prevItemType = ITEM_TYPE;
        } else if (line.match(xitLineTypePatterns.obsoleteItem)) {
            addXitObjectLine(ITEM_TYPE, ITEM_STATUS_OBSOLETE, line);
            prevItemType = ITEM_TYPE;
        } else if ((prevItemType === ITEM_TYPE || prevItemType === ITEM_DETAILS_TYPE) && line.match(xitLineTypePatterns.itemDetails)) {
            addXitObjectLine(ITEM_DETAILS_TYPE, null, line);
            prevItemType = ITEM_DETAILS_TYPE;
        } else if (line.match(/^[\n\r]*/gm)) {
            prevItemType = null;
        } else {
            throw `ParserError: One or more lines of provided Xit are invalid starting on L${idx} with content: ${line}`;
        }
    });

    return xitObject;
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
    const xitObj = fileToObject(fs.readFileSync('C:\\Users\\david\\Documents\\Prog\\xit-go\\lib\\tester.xit').toString());
})();