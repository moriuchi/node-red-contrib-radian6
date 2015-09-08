/*
 * 
 */
module.exports = function(RED) {
    "use strict";
    var request = require("request");
    var url = require("url");
    var xml2js = require('xml2js');
    var parseString = xml2js.parseString;
    
    var apiEndpoint = "api.radian6.com"; 

    function Radian6Node(n) {
        RED.nodes.createNode(this,n);
    }
    RED.nodes.registerType("radian6-credentials", Radian6Node, {
        credentials: {
            userId: {type:"text"},
            clientId: {type:"text"},
            clientSecret: {type:"password"},
            apiKey: {type:"password"},
            accessToken: {type:"password"}
        }
    });


    function parseXml2Json(xml){
        var json = null;
        parseString(xml, {explicitArray: false}, function (err, result) {
            json = result;
        });
        return json;
    }
    
    
    RED.httpAdmin.get('/radian6-credentials/auth', function(req, res) {
        if (!req.query.clientId || !req.query.clientSecret || !req.query.apiKey ||
            !req.query.id || !req.query.callback) {
            res.send(400);
            return;
        }
        var node_id = req.query.id;
        var callback = req.query.callback;
        var credentials = {
            clientId: req.query.clientId,
            clientSecret: req.query.clientSecret,
            apiKey: req.query.apiKey
        };
        
        var options = {
            url: 'https://' + apiEndpoint + '/socialcloud/v1/auth/authenticate',
            headers: {
                auth_user: credentials.clientId,
                auth_pass: credentials.clientSecret,
                auth_appkey: credentials.apiKey
            }
        };
        request(options, function(err, result, data) {
            if (err) {
                console.log("request error:" + err);
                return res.send("request error:" + err);
            }
            if (result.statusCode != 200 || result.statusCode != "200") {
                var errMesage = parseXml2Json(data);
	            return res.send("error:(" + result.statusCode + ")" + errMesage.error);
            }
            var resData = parseXml2Json(data);
            credentials.accessToken = resData.auth.token;
            credentials.userId = resData.auth.UserDetails.user.userId;
            RED.nodes.addCredentials(node_id, credentials);
            res.send("<html><head></head><body>Authorised - you can close this window and return to Node-RED</body></html>");
        });
    });

    RED.httpAdmin.get('/radian6-topic/topics', function(req, res) {
        var radian6Credentials = RED.nodes.getCredentials(req.query.credentials);
        if (!req.query.id || !req.query.credentials ||
            !radian6Credentials || !radian6Credentials.accessToken || !radian6Credentials.apiKey) {
//            res.send(400);
//            return;
            return res.send('{"error": "Missing radian6 credentials"}');
        }
        var credentials = {
            clientId: radian6Credentials.clientId,
            clientSecret: radian6Credentials.clientSecret,
            apiKey: radian6Credentials.apiKey,
            accessToken: radian6Credentials.accessToken
        };
        RED.nodes.addCredentials(req.query.credentials, credentials);
        
        var options = {
            url: 'https://' + apiEndpoint + '/socialcloud/v1/topics?basic=1',
            headers: {
                auth_token: radian6Credentials.accessToken,
                auth_appkey: radian6Credentials.apiKey
            }
        };
        request(options, function(err, result, data) {
            if (err) {
                return res.send('{"error": "request error:' + err + '"}');
            }
            if (result.statusCode != 200 || result.statusCode != "200") {
                var errMesage = parseXml2Json(data);
	            return res.send('{"error": "(' + result.statusCode + ') ' + errMesage.error + '"}');
            }
            var resData = {};
            resData["topiclist"] = parseXml2Json(data);
            
            // Get Media Types
            options = {
                url: 'https://' + apiEndpoint + '/socialcloud/v1/lookup/mediaproviders',
                headers: {
                    auth_token: radian6Credentials.accessToken,
                    auth_appkey: radian6Credentials.apiKey
                }
            };
            request(options, function(err, result, data) {
                if (err) {
                    return res.send('{"error": "request error:' + err + '"}');
                }
                if (result.statusCode != 200 || result.statusCode != "200") {
                    var errMesage = parseXml2Json(data);
    	            return res.send('{"error": "(' + result.statusCode + ') ' + errMesage.error + '"}');
                }
                resData["mediaTypes"] = parseXml2Json(data);

                res.send(resData);
            });
        });
    });


    RED.httpAdmin.get('/radian6-topic/topicdetail', function(req, res) {
        var radian6Credentials = RED.nodes.getCredentials(req.query.credentials);
        if (!req.query.id || !req.query.credentials ||
            !radian6Credentials || !radian6Credentials.accessToken || !radian6Credentials.apiKey) {
            return res.send('{"error": "Missing radian6 credentials"}');
        }
        var credentials = {
            clientId: radian6Credentials.clientId,
            clientSecret: radian6Credentials.clientSecret,
            apiKey: radian6Credentials.apiKey,
            accessToken: radian6Credentials.accessToken
        };
        RED.nodes.addCredentials(req.query.credentials, credentials);
        
        var options = {
                url: 'https://' + apiEndpoint + '/socialcloud/v1/topics/' + req.query.topicid,
                headers: {
                    auth_token: radian6Credentials.accessToken,
                    auth_appkey: radian6Credentials.apiKey
                }
            };
        request(options, function(err, result, data) {
            if (err) {
                return res.send('{"error": "request error:' + err + '"}');
            }
            if (result.statusCode != 200 || result.statusCode != "200") {
                var errMesage = parseXml2Json(data);
	            return res.send('{"error": "(' + result.statusCode + ') ' + errMesage.error + '"}');
            }
            var resData = {};
            resData["topicDetail"] = parseXml2Json(data);
            
            res.send(resData);
        });
    });


    function Radian6QueryNode(n) {
        RED.nodes.createNode(this,n);
        this.topicid = n.topicid;
        this.mediatype = n.mediatype;
        this.rangetype = n.rangetype;
        this.hours = n.hours;
        this.daterangeStart = n.daterangeStart;
        this.daterangeEnd = n.daterangeEnd;
        this.pagesize = n.pagesize;
        this.pageindex = n.pageindex;
        this.keyword = n.keyword;
        this.excludekeyword = n.excludekeyword;
        this.keywordgroups = n.keywordgroups;
        this.radian6 = RED.nodes.getNode(n.radian6);

        var node = this;
        if (!this.radian6 || !this.radian6.credentials
            || !this.radian6.credentials.accessToken
            || !this.radian6.credentials.apiKey) {
            this.warn("Missing radian6 credentials");
            return;
        }

        node.on("input", function(msg) {
            var topicid = node.topicid || msg.topicid;
            var mediatype = node.mediatype || msg.mediatype;
            var rangetype = node.rangetype || msg.rangetype;
            var hours = node.hours || msg.hours || 24;
            var daterangeStart = node.daterangeStart || msg.daterangeStart;
            var daterangeEnd = node.daterangeEnd || msg.daterangeEnd;
            var pagesize = node.pagesize || msg.pagesize || 20;
            var pageindex = node.pageindex || msg.pageindex || 1;
            var keyword = node.keyword || msg.keyword;
            var excludekeyword = node.excludekeyword || msg.excludekeyword;
            var keywordgroups = node.keywordgroups || msg.keywordgroups;

            if (topicid === "") {
                node.warn("No topicId specified");
                return;
            }
            msg.topicid = topicid;
            msg.mediatype = mediatype;
            msg.rangetype = rangetype;
            msg.hours = hours;
            msg.daterangeStart = daterangeStart;
            msg.daterangeEnd = daterangeEnd;
            msg.pagesize = pagesize;
            msg.pageindex = pageindex;
            msg.keyword = keyword;
            msg.excludekeyword = excludekeyword;
            msg.keywordgroups = keywordgroups;

            node.status({fill:"blue",shape:"dot",text:"get post data"});

            // Data Service
            var url = 'https://' + apiEndpoint + '/socialcloud/v1/data/topicdata/realtime/';
            if(rangetype == "dates"){
                var rangeSt = new Date(daterangeStart).getTime();
                var rangeEd = new Date(daterangeEnd).getTime();
                url += rangeSt + '/' + rangeEd + '/';
            } else {
                url += hours + '/';
            }
            url += topicid + '/' + mediatype + '/' + pageindex + '/' + pagesize;

            var queryParam = [];

            if(keywordgroups){
                queryParam.push("keywordGroups=1");
            }
            if(keyword){
                queryParam.push("keyword=" + keyword);
            }
            if(excludekeyword){
                queryParam.push("excludekeyword=" + excludekeyword);
            }
            if(queryParam.length > 0){
                url += "?" + queryParam.join("&");
            }
//console.log(url);
            var options = {
                url: url,
                headers: {
                    auth_token: node.radian6.credentials.accessToken,
                    auth_appkey: node.radian6.credentials.apiKey
                }
            };
            request(options, function(err, result, data) {
                if (err) {
                    node.error("request error:" + err);
                }
                if (result.statusCode != 200 || result.statusCode != "200") {
                    var errMesage = parseXml2Json(data);
                    node.error("error:(" + result.statusCode + ")" + errMesage.error);
                }
                var resDatas = parseXml2Json(data);
//console.log(JSON.stringify(resDatas));

                msg.payload = resDatas;
                node.status({});
                node.send(msg);
            });
        });
    }
    RED.nodes.registerType("radian6-topic", Radian6QueryNode);

};
