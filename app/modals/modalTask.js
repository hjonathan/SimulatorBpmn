var _ = require("lodash"),
    $ = require("jquery");

var ModalTask = function (e) {
    this.e = null;
    this.$el =  $(_.template($("#pmTask").html())({}));
    ModalTask.prototype.init.call(this, e);
};

_.extend(ModalTask.prototype, {
    init: function (e) {
        this.e = e;
        return this;
    },
    render : function (){
        return this;
    }
});

module.exports = ModalTask;