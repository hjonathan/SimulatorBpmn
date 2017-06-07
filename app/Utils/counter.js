var _ = require("lodash"),
    $$ = require("jquery");

var Counter = function (e) {
    this.e = null;
    this.$el =  $$(_.template($$("#pmCounter").html())({id:e.id}));
    Counter.prototype.init.call(this, e);
};

_.extend(Counter.prototype, {
    init: function (e) {
        this.e = e;
        return this;
    },
    render : function (){
        var a = this, data;
        $$(document.body).append(this.$el);
        
        data = this.calculatePosition(this.e);
        this.$el.css("top", data.top-40);
        this.$el.css("left",data.left);
        this.$el.show();
        /*var r = $(document.body).find(".pmModal");
        if(r.length != 0){
            r.remove();
        }
        $(document.body).append(this.modal);*/
        return this;
    },
    calculatePosition: function (e){
        var obj = $$(modeler._container).find("g[data-element-id="+ this.e.id+"]"),
            data = obj[0].getBoundingClientRect();
        return {
            top:data.top,
            left:data.left
        };
    },
    remove : function (){
        var r = $$(document.body).find("#pmc-"+this.e.id);
        if(r.length != 0){
            r.remove();
        }
        return this;
    },
    update : function (data){
        this.updateCases(data.cases);
        this.updateTime(data.executionTime);
        return this;
    },
    updateCases : function (cases){
        this.$el.find(".pmcasesc").html(cases);
        return this;
    },
    updateTime : function (time){
        var defineTime = 1000;
        var delta = (time-defineTime)/defineTime;
        
        var ncolor = (255-(delta*255))/2; 
        
        this.$el.find(".pmtime").css("background","rgba(159, "+ parseInt(ncolor) +", 31, 1)");
        this.$el.find(".pmtimec").html(time);
        return this;
    },
    defineColors : function (time){
        //if()
    }
});

module.exports = Counter;