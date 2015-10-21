// ==UserScript==
// @name          V1 Extra Buttons
// @description	  Adds default Task Buttons for VersionOne
// @include       https://www11.v1host.com/VentyxProd/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.min.js
// @require       https://gist.githubusercontent.com/BrockA/2625891/raw/fd02ec05e3079cdd52cf5892a7ba27b67b6b6131/waitForKeyElements.js
// @author        rf5860
// @version       0.1
// @updateURL     https://github.com/rf5860/V1-Extra-Buttons/raw/master/v1-extra-buttons.user.js
// @downloadURL   https://github.com/rf5860/V1-Extra-Buttons/raw/master/v1-extra-buttons.user.js
// ==/UserScript==
// Style
var TASK_URL =  'https://www11.v1host.com/VentyxProd/rest-1.v1/Data/Task';
var TASK_CREATE_RELATIVE_URL = "/VentyxProd/rest-1.v1/New/Task";
var DEV_TASK_NAME = 'Development';
var CODE_REVIEW_TASK_NAME = 'Code Review';
var AUTOMATED_TESTING_TASK_NAME = 'Automated Testing';
var TESTING_TASK_NAME = 'Testing';
var TEST_CASE_REVIEW_TASK_NAME = 'Test Case Review';
var DOCUMENTATION_TASK_NAME = 'Documentation';
var DOCUMENTATION_REVIEW_TASK_NAME = 'Documentation Review';

var TESTING_TASK_CATEGORY = '538305';
var DEVELOPMENT_TASK_CATEGORY = '112';
var DOCUMENTATION_TASK_CATEGORY = '493515';

var DATA_TYPE = 'application/xml';

var STORY_TYPE = 'Story';
var DEFECT_TYPE = 'Defect';

var TASK_DATA = '      <Asset href="'+TASK_CREATE_RELATIVE_URL+'">'+
        '       <Attribute name="Name" act="set">{Name}</Attribute>'+
        '       <Relation name="Parent" act="set">'+
        '       <Asset href="VentyxProd/rest-1.v1/Data/{Type}/{Id}" idref="{Parent}" />'+
        '       </Relation>'+
        '       <Relation name="Category" act="set">'+
        '       <Asset href="VentyxProd/rest-1.v1/Data/TaskCategory/{CategoryId}" idref="TaskCategory:{CategoryId}"/>'+
        '       </Relation>'+
        '       </Asset>';

function createTask(parent, name, category) {
    var data = TASK_DATA.replace('{Name}', name)
            .replace('{Parent}', parent)
            .replace('{Type}', parent.split(':')[0])
            .replace('{CategoryId}', category)
            .replace('{CategoryId}', category)
            .replace('{Id}', parent.split(':')[1]);
    console.log('Request data: '+data);
    $.ajax({url:TASK_URL, type:'POST',
            data: data,
            contentType:DATA_TYPE});
}

function createTasks(parent) {
    createTask(parent, DEV_TASK_NAME, DEVELOPMENT_TASK_CATEGORY);
    createTask(parent, TESTING_TASK_NAME, TESTING_TASK_CATEGORY);
    createTask(parent, AUTOMATED_TESTING_TASK_NAME, DEVELOPMENT_TASK_CATEGORY);
    createTask(parent, CODE_REVIEW_TASK_NAME, DEVELOPMENT_TASK_CATEGORY);
    window.location.reload();
}

function createStoryTasks(parent) {
    createTask(parent, DOCUMENTATION_TASK_NAME, DOCUMENTATION_TASK_CATEGORY);
    createTask(parent, DOCUMENTATION_REVIEW_TASK_NAME, DOCUMENTATION_TASK_CATEGORY);
    createTask(parent, TEST_CASE_REVIEW_TASK_NAME, TESTING_TASK_CATEGORY);
    createTasks(parent);
}

var added = false;
function addButons(d) {
    var oId = $('body>div[data-oid-token]').attr('data-oid-token');
    console.log('Id Token=['+oId+']');
    if (!added) {
        added = true;
        var parent = $(d).parent().first();
        var createElem = parent.clone()[0];
        createElem.setAttribute('id', 'createStandardItemsButton');
        createElem.children[0].removeAttribute('_handler');
        createElem.children[0].textContent = 'Create Standard Tasks';
        $(createElem).insertAfter(parent);
        $(createElem).click(function () { oId.startsWith('B') ? createStoryTasks(oId) : createTasks(oId); });
        $('<div style="width:0.2em" class="actions">').insertBefore($(createElem));
    }
}

waitForKeyElements('div.create-btn>a:contains("Add")', addButons, false);
