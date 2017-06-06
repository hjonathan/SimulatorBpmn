var _ = require("lodash"),
    $$ = require("jquery");

var ModalTask = function (e) {
    this.e = null;
    this.$el =  $$(_.template($$("#pmTask").html())({}));
    ModalTask.prototype.init.call(this, e);
};

_.extend(ModalTask.prototype, {
    init: function (e) {
        this.e = e;
        return this;
    },
    render : function (){
        return this;
    },
    getData : function (){
        var data = {
            timeWaitInit:  this.$el.find("#timeWaitInit").val(),
            timeDuration: this.$el.find("#timeDuration").val()
        };
        return data;
    }
});

module.exports = ModalTask;