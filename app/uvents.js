/**
 * Created by jonathan on 1/06/17.
 */
var _ = require("lodash");
var $ =  require("jquery");
var Crown = require("./crownSettings");

var uvents = function (data){
    this.modal = null;
    uvents.prototype.init.call(this, data);
};

_.extend(uvents.prototype, {
   init: function (data){
       //this.modal= $(_.template($("#modalboot").html())({}));
       //$(document.body).append(this.modal);
       return this;
   },
   click: function (e){
       this.createCrownForElement(e);
       if(window.schema[e.element.id] && window.schema[e.element.id].crown) {
           window.schema[e.element.id].crown.render();
       }
       return this;
   },
    out : function (){

    },
    hover : function (e){

    },
    dblclick : function (){

    },
    mousedown : function (){

    },
    mouseup : function (){

    },
    createCrownForElement : function (e){
        this.filter(e, function (dt){
            if(window.schema){
                if(!window.schema[e.element.id]){
                    window.schema[e.element.id] = {};
                }
                window.schema[e.element.id]["e"] = e;
            }
            if(!window.schema[e.element.id].crown){
                window.schema[e.element.id].crown = new Crown(e);
            }
        });
        return this;
    },
    filter: function (e, callback){
        switch (e.element.type){
            case "bpmn:StartEvent":
            case "bpmn:ScriptTask":
            case "bpmn:Task":
            case "bpmn:bpmn:EndEvent":
            case "bpmn:EndEvent":
            case "bpmn:ExclusiveGateway":
                callback(e);
                break;
            case "bpmn:Process":
                this.hideCrownModal();
                break;
            default:
                break;
        }
        return this;
    },
    hideCrownModal : function (){
        $(".pmCrown").remove();
        $(".pmModal").remove();
    }
});

module.exports = uvents;
