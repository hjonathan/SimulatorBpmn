var _ = require("lodash"),
    $ = require("jquery");

var Marker = function (e) {
    this.e = null;
    this.$el =  $(_.template($("#pmMarker").html())({}));
    Marker.prototype.init.call(this, e);
};

_.extend(Marker.prototype, {
    init: function (e) {
        this.e = e;
        return this;
    },
    render : function (){
        return this;
    }
});

module.exports = Marker;