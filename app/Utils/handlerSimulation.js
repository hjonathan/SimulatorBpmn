var _ = require("lodash"),
    counter = require("./counter"),
    $$ = require("jquery");

var HandlerSimulation = function (e) {
    this.objects = [];
    HandlerSimulation.prototype.init.call(this, e);
};

_.extend(HandlerSimulation.prototype, {
    init: function (e) {
    },
    start : function (json){
        this.objects = [];
        this.findObjects(json);
        this.createCounters();
        return this;
    },
    update : function (data){
        var that = this;
        _.each(this.objects,function(obj, index){
            if(data[obj.id]) {
                if (obj.pmCounter) {
                    obj.pmCounter.update(data[obj.id]);
                }
            }
        });
    },
    createCounters : function (){
        var that = this;
        _.each(this.objects,function(obj, index){
            that.createCounter(obj);
            if(window.schema[obj.id] && window.schema[obj.id].counter){
                window.schema[obj.id].counter.render();
            }
        });
        return this;
    },
    createCounter : function (obj){
        if(!window.schema[obj.id]){
            window.schema[obj.id]={};
        }
        if(!window.schema[obj.id].counter){
            window.schema[obj.id].counter = new counter(obj);
        }
        return this;
    },
    findObjects  : function (json){
        var that = this;
        this.browseFields(json, function (obj){
            switch (obj["$type"]){
                case "bpmn:StartEvent":
                case "bpmn:Task":
                case "bpmn:bpmn:EndEvent":
                case "bpmn:EndEvent":
                case "bpmn:ExclusiveGateway":
                    that.addToSchema(obj);
                    that.objects.push(obj);
                    break;
                case "bpmn:Process":
                    break;
                default:
                    break;
            }
        });
        return this;
    },
    addToSchema : function (obj){
        if(window.schema){
            if(!window.schema[obj.id]){
                window.schema[obj.id] = {};
            }
            window.schema[obj.id]["obj"] = obj;
        }
        return this;
    },
    browseFields: function (json, callbackAction) {
        var that = this;
        if ((_.isObject(json) || _.isArray(json)) && _.isFunction(callbackAction)) {
            _.mapValues(json, function (value, key, obj) {
                if(_.has(obj, "pmCounter")){
                    obj["pmCounter"].remove();
                    delete obj["pmCounter"];
                }
                if (key === "$type") {
                    if (_.isObject(obj) && _.has(obj, "id") && _.has(obj, "$type") && !_.has(obj, "flowElements") && !_.has(obj, "rootElements")) {
                        callbackAction(obj);
                    }
                }
                if (_.isObject(value)) {
                    that.browseFields(value, callbackAction);
                }
            });
        }
        return this;
    }
});

module.exports = HandlerSimulation;