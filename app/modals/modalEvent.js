var _ = require("lodash"),
    $ = require("jquery");

var ModalEvent = function (e) {
    this.e = null;
    this.$el =  $(_.template($("#pmTask").html())({}));
    ModalEvent.prototype.init.call(this, e);
};

_.extend(ModalEvent.prototype, {
    init: function (e) {
        this.e = e;
        return this;
    },
    render : function (){
        return this;
    }
});

module.exports = ModalEvent;