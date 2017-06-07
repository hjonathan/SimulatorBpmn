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
        this.startSimulation();
        return this;
    },
    stop : function (){
        if(this.cron){
            clearInterval(this.cron);
        }
        $$(".well.well-sm.pmCount").remove();
    },
    startSimulation : function (){
        this.simulation();   
    },
    
    simulation: function (){
        var that= this;
        this.cron = setInterval(function () {
            window.ws.simulation({}, function (err, data){
                if(!err){
                    that.update(data);
                }
            });
        },1000);
    },

    findStartEvent : function (){
        for (var i= 0; i< this.objects.length ; i++){
            if(this.objects[i].$type == "bpmn:StartEvent"){
               if(window.schema[this.objects[i].$type].data){
                    return this.objects[i].$type.data;
               }
            }
        }
        return false;   
    },
    update : function (data){
        var that = this;
        _.each(data, function (value, dt){
            var el =that.findByName(value.taskName);
            if(el){
                window.schema[el.id].counter.update(value);    
            }
        });

        /*_.each(this.objects,function(obj, index){
            if(data[obj.name]) {
                if (obj.pmCounter) {
                    obj.pmCounter.update(data[obj.id]);
                }
            }
        });*/
    },
    findByName : function (name){
        for (var i= 0; i< this.objects.length ; i++){
            if(this.objects[i].name == name){
                return this.objects[i];
            }
        }
        return false;        
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
                case "bpmn:Task":
                case "bpmn:ScriptTask":
                case "bpmn:ExclusiveGateway":
                    that.addToSchema(obj);
                    that.objects.push(obj);
                    break;
                case "bpmn:StartEvent":
                case "bpmn:EndEvent":
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