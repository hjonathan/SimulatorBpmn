var _ = require("lodash"),
    $ = require("jquery"),
    mTask = require("./modalTask"),
    mGateway = require("./modalGateway"),
    mEvent = require("./modalEvent");

var Modal = function (e) {
    this.adapter = null;
    this.e = null;
    this.modal =  $(_.template($("#modalboot").html())({}));
    Modal.prototype.init.call(this, e);
};

_.extend(Modal.prototype, {
    init: function (e) {
        this.e = e;
        this.adapter = this.createModal();
        return this;
    },
    createModal : function (){
        var resp;
        switch (this.e.element.type){
            case "bpmn:StartEvent":
            case "bpmn:EndEvent":
                resp = new mEvent(this.e);
                break;
            case "bpmn:Task":
                resp = new mTask(this.e);
                break;
            case "bpmn:ExclusiveGateway":
                resp = new mGateway(this.e);
                break;
            case "bpmn:Process":
                break;
            default:
                break;
        }
        return resp;
    },
    render : function (){
        var d = this.calculatePosition(this.e);
        this.resetModal();
        this.adapter.render();
        this.addContent(this.adapter.$el);
        this.modal.css("top", d.top);
        this.modal.css("left",d.left);
        this.modal.show();
        return this;
    },
    resetModal : function (){
        var r = $(document.body).find(".pmModal");
        if(r.length != 0){
            r.remove();
        }
        $(document.body).append(this.modal);
        return this;
    },
    addContent : function (el){
        this.modal.find(".modal-body").html(el);
        return this;
    },
    calculatePosition: function (e){
        var data = e.gfx.getBoundingClientRect();
        return {
            top:data.top,
            left:data.left
        };
    },
});

module.exports = Modal;