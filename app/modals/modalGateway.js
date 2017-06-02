var _ = require("lodash"),
    $ = require("jquery");

var ModalGateway = function (e) {
    this.e = null;
    this.$el =  $(_.template($("#pmTask").html())({}));
    ModalGateway.prototype.init.call(this, e);
};

_.extend(ModalGateway.prototype, {
    init: function (e) {
        this.e = e;
        return this;
    },
    render : function (){
        return this;
    }
});

module.exports = ModalGateway;