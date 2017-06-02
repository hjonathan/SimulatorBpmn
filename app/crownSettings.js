var _ = require("lodash"),
    $ = require("jquery");
    modal = require("./modals/modal");
var Crown = function (e) {
    this.template = null;
    this.$el = null;
    this.modal = null;
    this.e = null;
    Crown.prototype.init.call(this, e);
};

_.extend(Crown.prototype, {
    init: function (e) {
        this.e = e;
        this.modal = new modal(e);
        this.$el = $(_.template($("#pmSettings").html())({}));
        return this;
    },
    render: function () {
         var d = this.calculatePosition(this.e);
         this.$el.hide();
         this.showCrown();
         this.$el.css("top", d.top-20);
         this.$el.css("left",d.left-20);
         this.$el.show();
         this.$el.click(this.click());
        return this;
    },
    calculatePosition: function (e){
        var data = e.gfx.getBoundingClientRect();
        return {
            top:data.top,
            left:data.left
        };
    },
    showCrown : function (){
        var r = $(document.body).find(".pmCrown");
        if(r.length != 0){
            r.remove();
        }
        $(document.body).append(this.$el);
        return this;
    },
    click: function (){
        var that = this;
        return function (e){
            that.modal.render();
        };
    }
});

module.exports = Crown;