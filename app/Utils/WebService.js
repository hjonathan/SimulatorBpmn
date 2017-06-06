var $$ = require("jquery");
var WebServiceManager = function (options) {
    /*
     options.keys
     options.endPoints
     options.urlBase
     options.token
     */
    this.options = options || {};
    this.options.endPoints = {
        import: "processes/import",
        configuration : "processes/{processId}/task/{taskId}/simulation/configuration",
        simulation:"simulation"
    };
    this.options.links = {
        showDocument: "{server}/sys{workspace}/en/{skin}/cases/cases_ShowDocument?a={docUID}&v=1"
    };
    this.options.urlBase = "{server}/api/v1/{endPointPath}";

    this.options.urlBaseStreaming = "{server}/sys{workspace}/{endPointPath}";

};

WebServiceManager.prototype.getFullEndPoint = function (keys, urlBase, endPoint) {
    var k;
    urlBase = urlBase.replace(/{endPointPath}/, endPoint);
    for (k in keys) {
        if (keys.hasOwnProperty(k)) {
            urlBase = urlBase.replace(new RegExp("{" + k + "}", "g"), keys[k]);
        }
    }
    return urlBase;
};

WebServiceManager.prototype.setKey = function (name, value) {
    if (this.options.keys)
        this.options.keys[name] = value;
    return this;
};

WebServiceManager.prototype.getKey = function (name) {
    var resp = false;
    if (this.options.keys)
        resp = this.options.keys[name];
    return resp;
};

WebServiceManager.prototype.deleteKey = function (name, value) {
    if (this.options.keys)
        delete this.options.keys[name];
    return this;
};

WebServiceManager.prototype.getToken = function () {
    return this.options.token;
};

WebServiceManager.prototype.import = function (data,callback) {
    var that = this,
        ajax,
        resp,
        url = that.getFullEndPoint(that.options.keys, that.options.urlBase, that.options.endPoints.import),
        method = "POST";
    ajax = $$.ajax({
        url: url,
        type: method,
        async: true,
        data: JSON.stringify(data),
        contentType: "application/json",
        beforeSend: function (xhr) {

        },
        success: function (data, textStatus) {
            callback(null, data);
        },
        error: function (xhr, textStatus, errorThrown) {
            callback({}, null);
        }
    });
    return ajax;
};

WebServiceManager.prototype.configuration = function (config,data,callback) {
    var that = this,
        ajax,
        url,
        method = "POST";

    this.setKey("processId",config["processId"]);
    this.setKey("taskId",config["taskId"]);
    url = that.getFullEndPoint(that.options.keys, that.options.urlBase, that.options.endPoints.configuration);

        ajax = $$.ajax({
        url: url,
        type: method,
        async: true,
        data: JSON.stringify(data),
        contentType: "application/json",
        beforeSend: function (xhr) {

        },
        success: function (data, textStatus) {
            callback(null, data);
        },
        error: function (xhr, textStatus, errorThrown) {
            callback({}, null);
        }
    });
    return ajax;
};

WebServiceManager.prototype.simulation = function (config,data,callback) {
    var that = this,
        ajax,
        url,
        method = "POST";

    url = that.getFullEndPoint(that.options.keys, that.options.urlBase, that.options.endPoints.simulation);

    ajax = $$.ajax({
        url: url,
        type: method,
        async: true,
        data: JSON.stringify(data),
        contentType: "application/json",
        beforeSend: function (xhr) {

        },
        success: function (data, textStatus) {
            callback(null, data);
        },
        error: function (xhr, textStatus, errorThrown) {
            callback({}, null);
        }
    });
    return ajax;
};

module.exports = WebServiceManager;