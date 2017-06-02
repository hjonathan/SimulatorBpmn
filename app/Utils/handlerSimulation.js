var _ = require("lodash"),
    $ = require("jquery");

var HandlerSimulation = function (e) {
    this.objects = [];
    HandlerSimulation.prototype.init.call(this, e);
};

_.extend(HandlerSimulation.prototype, {
    init: function (e) {
    },
    start : function (json){
        this.findObjects(json);
        this.createCounters();
        return this;
    },
    createCounters : function (){
        _.each(this.objects,function(key, value){

        });
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
    browseFields: function (json, callbackAction) {
        var that = this;
        if ((_.isObject(json) || _.isArray(json)) && _.isFunction(callbackAction)) {
            _.mapValues(json, function (value, key, obj) {
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