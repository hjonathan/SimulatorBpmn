var _ = require("lodash"),
    $$ = require("jquery");

var ModalEvent = function (e) {
    this.e = null;
    this.$el =  $$(_.template($$("#pmStartEvent").html())({}));
    ModalEvent.prototype.init.call(this, e);
};

_.extend(ModalEvent.prototype, {
    init: function (e) {
        this.e = e;
        return this;
    },
    render : function (){
        return this;
    },
    getData : function (){
        var data = {
            cases: this.$el.find("#pmNumberCases").val()
        };
        return data;
    }
});

module.exports = ModalEvent;