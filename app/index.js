'use strict';

var fs = require('fs');

var $ = require('jquery'),
    BpmnModeler = require('bpmn-js/lib/Modeler');

var container = $('#js-drop-zone');

var canvas = $('#js-canvas');

var modeler = new BpmnModeler({container: canvas});
var uvents = require("./uvents");
var sim = require("./Utils/handlerSimulation");
var webService = require("./Utils/WebService");
var dws = {
    keys: {
        "server": "http://172.16.3.11:9001"
    }
};

var ws = new webService(dws);
var Simulator = new sim();

var newDiagramXML = fs.readFileSync(__dirname + '/../resources/newDiagram.bpmn', 'utf-8');

function createNewDiagram() {
    openDiagram(newDiagramXML);
}

function openDiagram(xml) {
    ws.import({
        data:{
            type:"string",
            attributes:{
                bpmn:xml
            }
        }
    }, function (err, data){
        if(!err){
            window.configuration.processId = data.data[0].id;
        }
    });
    modeler.importXML(xml, function (err) {
        if (err) {
            container
                .removeClass('with-diagram')
                .addClass('with-error');

            container.find('.error pre').text(err.message);

            console.error(err);
        } else {
            container
                .removeClass('with-error')
                .addClass('with-diagram');
        }


    });
}

function saveSVG(done) {
    modeler.saveSVG(done);
}

function saveDiagram(done) {

    modeler.saveXML({format: true}, function (err, xml) {
        done(err, xml);
    });
}

function registerFileDrop(container, callback) {

    function handleFileSelect(e) {
        e.stopPropagation();
        e.preventDefault();

        var files = e.dataTransfer.files;

        var file = files[0];

        var reader = new FileReader();

        reader.onload = function (e) {

            var xml = e.target.result;

            callback(xml);
        };

        reader.readAsText(file);
    }

    function handleDragOver(e) {
        e.stopPropagation();
        e.preventDefault();

        e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    container.get(0).addEventListener('dragover', handleDragOver, false);
    container.get(0).addEventListener('drop', handleFileSelect, false);
}


////// file drag / drop ///////////////////////

// check file api availability
if (!window.FileList || !window.FileReader) {
    window.alert(
        'Looks like you use an older browser that does not support drag and drop. ' +
        'Try using Chrome, Firefox or the Internet Explorer > 10.');
} else {
    registerFileDrop(container, openDiagram);
}

// bootstrap diagram functions

$(document).on('ready', function () {

    $('#js-create-diagram').click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        container
            .removeClass('with-error')
            .addClass('with-diagram');
        modeler.createDiagram();
      //  createNewDiagram();
    });

    var downloadLink = $('#js-download-diagram').click(function (){
        console.log("Save Diagram");
        saveDiagram(function (err, xml) {
            setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml);
        });
    });
    var downloadSvgLink = $('#js-download-svg').click(function (){
        console.log("jonas");
    });


    $('.buttons a').click(function (e) {
        if (!$(this).is('.active')) {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    function setEncoded(link, name, data) {
        var encodedData = encodeURIComponent(data);

        if (data) {
            link.addClass('active').attr({
                'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
                'download': name
            });
        } else {
            link.removeClass('active');
        }
    }

    var _ = require('lodash');

    var exportArtifacts = _.debounce(function () {

        saveSVG(function (err, svg) {
            setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg);
        });

        saveDiagram(function (err, xml) {
            setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml);
        });
    }, 500);

    var eventBus = modeler.get('eventBus');
    var uv = new uvents({});

    eventBus.on("element.hover", function (e) {
        uv.hover(e);
    });
    eventBus.on("element.out", function (e) {
        // e.element = the model element
        // e.gfx = the graphical element
        uv.out(e);
    });
    eventBus.on("element.click", function (e) {
        // e.element = the model element
        // e.gfx = the graphical element
        uv.click(e);
    });
    eventBus.on("element.dblclick", function (e) {
        // e.element = the model element
        // e.gfx = the graphical element
        uv.dblclick(e);
    });
    eventBus.on("element.mousedown", function (e) {
        // e.element = the model element
        // e.gfx = the graphical element
        uv.mousedown(e);
    });

    eventBus.on("element.mouseup", function (e) {
        // e.element = the model element
        // e.gfx = the graphical element
        uv.mouseup(e);
    });

    $("#js-pm-play-sim").click(function () {
        Simulator.start(modeler.definitions);
    });

    $("#js-pm-stop").click(function () {
        Simulator.stop();
    });

    window.modeler = modeler;
    window.jQuery = $;
    window.schema = {};
    window.ws = ws;
    window.configuration = {};

       // a = [{"executionTime":29699.805769231,"sdv":5939.9611538462,"cases":520,"id":136,"taskId":"cfdb0db2-8f97-4ceb-a0ed-e6be6dc3ee57","taskName":"Task 2","processId":39},{"executionTime":30933.330769231,"sdv":6186.6661538462,"cases":520,"id":137,"taskId":"53a9bf20-7353-41ff-b53c-5694bcbfb46d","taskName":"Task 4","processId":39},{"executionTime":29026.101727447,"sdv":5805.2203454894,"cases":521,"id":138,"taskId":"dbdb00b2-a594-44e1-ae58-03de344f6db9","taskName":"Start","processId":39}];



});