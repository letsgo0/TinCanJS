
/*!
    Copyright 2012 Rustici Software

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
;var TinCan;(function(){"use strict";var _environment=null;TinCan=function(a){this.log("constructor"),this.environment=null,this.recordStores=[],this.actor=null,this.activity=null,this.registration=null,this.context=null,this.init(a)},TinCan.prototype={LOG_SRC:"TinCan",log:function(a,b){TinCan.DEBUG&&console&&console.log&&(b=b||this.LOG_SRC||"TinCan",console.log("TinCan."+b+": "+a))},init:function(a){this.log("init");var b;a=a||{},a.hasOwnProperty("url")&&a.url!==""&&this._initFromQueryString(a.url);if(a.hasOwnProperty("recordStores")&&a.recordStores.length>0)for(b=0;b<a.recordStores.length;b+=1)this.addRecordStore(a.recordStores[b]);a.hasOwnProperty("activity")&&(a.activity instanceof TinCan.Activity?this.activity=a.activity:this.activity=new TinCan.Activity(a.activity))},_initFromQueryString:function(a){this.log("_initFromQueryString");var b,c,d=TinCan.Utils.parseURL(a).params,e=["endpoint","auth"],f,g,h;if(d.hasOwnProperty("actor")){this.log("_initFromQueryString - found actor: "+d.actor);try{this.actor=TinCan.Agent.fromJSON(d.actor),delete d.actor}catch(i){this.log("_initFromQueryString - failed to set actor: "+i)}}d.hasOwnProperty("activity_id")&&(this.activity=new TinCan.Activity({id:d.activity_id}));if(d.hasOwnProperty("activity_platform")||d.hasOwnProperty("registration")||d.hasOwnProperty("grouping"))h={},d.hasOwnProperty("activity_platform")&&(h.platform=d.activity_platform),d.hasOwnProperty("registration")&&(h.registration=this.registration=d.registration),d.hasOwnProperty("grouping")&&(h.contextActivities.grouping=d.grouping),this.context=new TinCan.Context(h);if(d.hasOwnProperty("endpoint")){for(b=0;b<e.length;b+=1)c=e[b],d.hasOwnProperty(c)&&(f[c]=d[c],delete d[c]);f.extended=d,f.allowFail=!1,this.addRecordStore(f)}},addRecordStore:function(a){this.log("addRecordStore");var b;a instanceof TinCan.LRS?b=a:b=new TinCan.LRS(a),this.recordStores.push(b)},prepareStatement:function(a){return this.log("prepareStatement"),a instanceof TinCan.Statement||(a=new TinCan.Statement(a)),a.actor===null&&this.actor!==null&&(a.actor=this.actor),a.target===null&&this.activity!==null&&(a.target=this.activity),this.context!==null&&(a.context===null?a.context=this.context:(a.context.registration===null&&(a.context.registration=this.context.registration),a.context.platform===null&&(a.context.platform=this.context.platform),this.context.contextActivities!==null&&(a.context.contextActivities===null?a.context.contextActivities=this.context.contextActivities:this.context.contextActivities.grouping!==null&&a.context.contextActivities.grouping===null&&(a.context.contextActivities.grouping=this.context.contextActivities.grouping)))),a},sendStatement:function(a,b){this.log("sendStatement");var c,d,e,f=this.recordStores.length,g,h;if(f>0){d=this.prepareStatement(a),f===1?e=b:typeof b=="function"&&(e=function(){this.log("sendStatement - callbackWrapper: "+f),f>1?f-=1:f===1?b.apply(this,arguments):this.log("sendStatement - unexpected record store count: "+f)});for(g=0;g<f;g+=1)c=this.recordStores[g],c.saveStatement(d,{callback:e})}else h="[warning] sendStatement: No LRSs added yet (statement not sent)",TinCan.environment().isBrowser?alert(this.LOG_SRC+": "+h):this.log(h)},getStatement:function(a,b){this.log("getStatement");var c,d,e,f=this.recordStores.length,g,h;if(f>0){f===1?e=b:typeof b=="function"&&(e=function(){this.log("sendStatement - callbackWrapper: "+f),f>1?f-=1:f===1?b.apply(this,arguments):this.log("sendStatement - unexpected record store count: "+f)});for(g=0;g<f;g+=1)c=this.recordStores[g],c.retrieveStatement(a,e)}else h="[warning] getStatement: No LRSs added yet (statement not sent)",TinCan.environment().isBrowser?alert(this.LOG_SRC+": "+h):this.log(h)},sendStatements:function(a,b){this.log("sendStatements");var c,d=[],e,f=this.recordStores.length,g,h;if(f>0){if(a.length>0){for(g=0;g<a.length;g+=1)d.push(this.prepareStatement(a[g]));f===1?e=b:typeof b=="function"&&(e=function(){this.log("sendStatements - callbackWrapper: "+f),f>1?f-=1:f===1?b.apply(this,arguments):this.log("sendStatements - unexpected record store count: "+f)});for(g=0;g<f;g+=1)c=this.recordStores[g],c.saveStatements(d,{callback:e})}}else h="[warning] sendStatements: No LRSs added yet (statements not sent)",TinCan.environment().isBrowser?alert(this.LOG_SRC+": "+h):this.log(h)},getStatements:function(a){this.log("getStatements");var b={},c,d,e;if(this.recordStores.length>0)return c=this.recordStores[0],a=a||{},d=a.params||{},a.sendActor&&this.actor!==null&&(d.actor=this.actor),a.sendActivity&&this.activity!==null&&(d.activity=this.activity),this.registration!==null&&(d.registration=this.registration),d.sparse=a.sparse||"false",b={params:d},typeof a.callback!="undefined"&&(b.callback=a.callback),c.queryStatements(b);e="[warning] getStatements: No LRSs added yet (statements not read)",TinCan.environment().isBrowser?alert(this.LOG_SRC+": "+e):this.log(e)},getState:function(a,b){this.log("getState");var c,d,e;if(this.recordStores.length>0)return d=this.recordStores[0],b=b||{},c={agent:typeof b.agent!="undefined"?b.agent:this.actor,activity:typeof b.activity!="undefined"?b.activity:this.activity},typeof b.registration!="undefined"?c.registration=b.registration:this.registration!==null&&(c.registration=this.registration),typeof b.callback!="undefined"&&(c.callback=b.callback),d.retrieveState(a,c);e="[warning] getState: No LRSs added yet (state not retrieved)",TinCan.environment().isBrowser?alert(this.LOG_SRC+": "+e):this.log(e)},setState:function(a,b,c){this.log("setState");var d,e,f;if(this.recordStores.length>0)return e=this.recordStores[0],c=c||{},d={agent:typeof c.agent!="undefined"?c.agent:this.actor,activity:typeof c.activity!="undefined"?c.activity:this.activity},typeof c.registration!="undefined"?d.registration=c.registration:this.registration!==null&&(d.registration=this.registration),typeof c.callback!="undefined"&&(d.callback=c.callback),e.saveState(a,b,d);f="[warning] setState: No LRSs added yet (state not saved)",TinCan.environment().isBrowser?alert(this.LOG_SRC+": "+f):this.log(f)},deleteState:function(a,b){this.log("deleteState");var c,d,e;if(this.recordStores.length>0)return d=this.recordStores[0],b=b||{},c={agent:typeof b.agent!="undefined"?b.agent:this.actor,activity:typeof b.activity!="undefined"?b.activity:this.activity},typeof b.registration!="undefined"?c.registration=b.registration:this.registration!==null&&(c.registration=this.registration),typeof b.callback!="undefined"&&(c.callback=b.callback),d.dropState(a,c);e="[warning] deleteState: No LRSs added yet (state not deleted)",TinCan.environment().isBrowser?alert(this.LOG_SRC+": "+e):this.log(e)},getActivityProfile:function(a,b){this.log("getActivityProfile");var c,d,e;if(this.recordStores.length>0)return d=this.recordStores[0],b=b||{},c={activity:typeof b.activity!="undefined"?b.activity:this.activity},typeof b.callback!="undefined"&&(c.callback=b.callback),d.retrieveActivityProfile(a,c);e="[warning] getActivityProfile: No LRSs added yet (activity profile not retrieved)",TinCan.environment().isBrowser?alert(this.LOG_SRC+": "+e):this.log(e)},setActivityProfile:function(a,b,c){this.log("setActivityProfile");var d,e,f;if(this.recordStores.length>0)return e=this.recordStores[0],c=c||{},d={activity:typeof c.activity!="undefined"?c.activity:this.activity},typeof c.callback!="undefined"&&(d.callback=c.callback),e.saveActivityProfile(a,b,d);f="[warning] setActivityProfile: No LRSs added yet (activity profile not saved)",TinCan.environment().isBrowser?alert(this.LOG_SRC+": "+f):this.log(f)},deleteActivityProfile:function(a,b){this.log("deleteActivityProfile");var c,d,e;if(this.recordStores.length>0)return d=this.recordStores[0],b=b||{},c={activity:typeof b.activity!="undefined"?b.activity:this.activity},typeof b.callback!="undefined"&&(c.callback=b.callback),d.dropActivityProfile(a,c);e="[warning] deleteActivityProfile: No LRSs added yet (activity profile not deleted)",TinCan.environment().isBrowser?alert(this.LOG_SRC+": "+e):this.log(e)}},TinCan.DEBUG=!1,TinCan.enableDebug=function(){TinCan.DEBUG=!0},TinCan.disableDebug=function(){TinCan.DEBUG=!1},TinCan.versions=function(){return["0.95","0.90"]},TinCan.environment=function(){return _environment===null&&(_environment={},typeof window!="undefined"?(_environment.isBrowser=!0,_environment.isIE=!1,typeof XDomainRequest!="undefined"&&(_environment.isIE=!0)):_environment.isBrowser=!1),_environment},TinCan.environment().isBrowser&&(window.JSON||(window.JSON={parse:function(sJSON){return eval("("+sJSON+")")},stringify:function(a){var b="",c,d;if(a instanceof Object){if(a.constructor===Array){for(c=0;c<a.length;c+=1)b+=this.stringify(a[c])+",";return"["+b.substr(0,b.length-1)+"]"}if(a.toString!==Object.prototype.toString)return'"'+a.toString().replace(/"/g,"\\$&")+'"';for(d in a)a.hasOwnProperty(d)&&(b+='"'+d.replace(/"/g,"\\$&")+'":'+this.stringify(a[d])+",");return"{"+b.substr(0,b.length-1)+"}"}return typeof a=="string"?'"'+a.replace(/"/g,"\\$&")+'"':String(a)}}))})(),function(){"use strict",TinCan.Utils={getUUID:function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(a){var b=Math.random()*16|0,c=a=="x"?b:b&3|8;return c.toString(16)})},getISODateString:function(a){function b(a,b){var c,d;a===null&&(a=0),b===null&&(b=2),c=Math.pow(10,b-1),d=a.toString();while(a<c&&c>1)d="0"+d,c/=10;return d}return a.getUTCFullYear()+"-"+b(a.getUTCMonth()+1)+"-"+b(a.getUTCDate())+"T"+b(a.getUTCHours())+":"+b(a.getUTCMinutes())+":"+b(a.getUTCSeconds())+"."+b(a.getUTCMilliseconds(),3)+"Z"},getLangDictionaryValue:function(a,b){var c=this[a],d;if(typeof b!="undefined"&&typeof c[b]!="undefined")return c[b];if(typeof c.und!="undefined")return c.und;if(typeof c["en-US"]!="undefined")return c["en-US"];for(d in c)if(c.hasOwnProperty(d))return c[d];return""},parseURL:function(a){var b=String(a).split("?"),c,d,e,f={};if(b.length===2){c=b[1].split("&");for(e=0;e<c.length;e+=1)d=c[e].split("="),d.length===2&&d[0]&&(f[d[0]]=decodeURIComponent(d[1]))}return{path:b[0],params:f}}}}(),function(){"use strict";var a="ie",b=TinCan.LRS=function(a){this.log("constructor"),this.endpoint=null,this.version=null,this.auth=null,this.allowFail=!0,this.alertOnRequestFailure=!0,this.extended=null,this._requestMode="native",this.init(a)};b.prototype={LOG_SRC:"LRS",log:TinCan.prototype.log,init:function(b){this.log("init");var c,d,e,f=TinCan.environment();b=b||{};if(!b.hasOwnProperty("endpoint"))throw f.isBrowser&&this.alertOnRequestFailure&&alert("[error] LRS invalid: no endpoint"),{code:3,mesg:"LRS invalid: no endpoint"};this.endpoint=b.endpoint,b.hasOwnProperty("allowFail")&&(this.allowFail=b.allowFail),b.hasOwnProperty("auth")&&(this.auth=b.auth),c=b.endpoint.toLowerCase().match(/([A-Za-z]+:)\/\/([^:\/]+):?(\d+)?(\/.*)?$/);if(f.isBrowser){d=location.protocol.toLowerCase()===c[1],e=!d||location.hostname.toLowerCase()!==c[2]||location.port!==(c[3]!==null?c[3]:c[1]==="http:"?"80":"443");if(e&&f.isIE)if(d)this._requestMode=a;else{if(!b.allowFail)throw this.alertOnRequestFailure&&alert("[error] LRS invalid: cross domain request for differing scheme in IE"),{code:2,mesg:"LRS invalid: cross domain request for differing scheme in IE"};this.alertOnRequestFailure&&alert("[warning] LRS invalid: cross domain request for differing scheme in IE")}}else this.log("Unrecognized environment not supported: "+f);typeof b.version!="undefined"&&(this.log("version: "+b.version),this.version=b.version)},sendRequest:function(b){function n(){m.log("requestComplete: "+d+", xhr.status: "+c.status);var a;if(!!d)return i;d=!0,a=b.ignore404&&c.status===404;if(!(c.status===undefined||c.status>=200&&c.status<400||a))return c.status>0&&alert("[warning] There was a problem communicating with the Learning Record Store. ("+c.status+" | "+c.responseText+")"),c;if(!b.callback)return i=c,c;b.callback(c)}this.log("sendRequest");var c,d=!1,e=window.location,f=this.endpoint+b.url,g={},h,i,j,k,l=[],m=this;if(this.extended!==null)for(k in this.extended)this.extended.hasOwnProperty(k)&&this.extended[k]!==null&&this.extended[k].length>0&&(b.params[k]=this.extended[k]);g["Content-Type"]="application/json",g.Authorization=this.auth,this.version!=="0.90"&&(g["X-Experience-API-Version"]=this.version);for(k in b.headers)b.headers.hasOwnProperty(k)&&(g[k]=b.headers[k]);if(this._requestMode==="native"){this.log("sendRequest using XMLHttpRequest");for(k in b.params)b.params.hasOwnProperty(k)&&l.push(k+"="+encodeURIComponent(b.params[k]));l.length>0&&(f+="?"+l.join("&")),c=new XMLHttpRequest,c.open(b.method,f,b.callback!==undefined);for(k in g)g.hasOwnProperty(k)&&c.setRequestHeader(k,g[k]);h=b.data}else if(this._requestMode===a){this.log("sendRequest using XDomainRequest"),f+="?method="+b.method;for(k in b.params)b.params.hasOwnProperty(k)&&l.push(k+"="+encodeURIComponent(g[k]));for(k in g)g.hasOwnProperty(k)&&l.push(k+"="+encodeURIComponent(g[k]));b.data!==null&&l.push("content="+encodeURIComponent(b.data)),h=l.join("&"),c=new XDomainRequest,c.open("POST",f)}else this.log("sendRequest unrecognized _requestMode: "+this._requestMode);c.onreadystatechange=function(){c.readyState===4&&n()},c.onload=n,c.onerror=n,c.send(h);if(!b.callback){if(this._requestMode===a){j=1e3+Date.now(),this.log("sendRequest: until: "+j+", finished: "+d);while(Date.now()<j&&!d)this.__delay()}return n()}},saveStatement:function(a,b){this.log("saveStatement");var c;TinCan.environment().isBrowser?(c={url:"statements",method:"PUT",params:{statementId:a.id},data:JSON.stringify(a.asVersion(this.version))},typeof b.callback!="undefined"&&(c.callback=b.callback),this.sendRequest(c)):this.log("error: environment not implemented")},retrieveStatement:function(a,b){this.log("retrieveStatement");var c;c=function(){var a;b.callback(a)},TinCan.environment().isBrowser?this.sendRequest({url:"statements",method:"GET",params:{statementId:a}}):this.log("error: environment not implemented")},saveStatements:function(a,b){this.log("saveStatements");var c=[],d,e;b=b||{};if(a.length>0){for(e=0;e<a.length;e+=1)c.push(a[e].asVersion(this.version));TinCan.environment().isBrowser?(d={url:"statements",method:"POST",data:JSON.stringify(c)},typeof b.callback!="undefined"&&(d.callback=b.callback),this.sendRequest(d)):this.log("error: environment not implemented")}},queryStatements:function(a){this.log("queryStatements");var b,c,d;if(!TinCan.environment().isBrowser){this.log("error: environment not implemented");return}return a=a||{},a.params=a.params||{},a.params.hasOwnProperty("target")&&(a.params.object=a.params.target),b=this._queryStatementsRequestCfg(a),typeof a.callback!="undefined"&&(d=function(b){var c=TinCan.StatementsResult.fromJSON(b.responseText);a.callback(c)},b.callback=d),c=this.sendRequest(b),typeof b.callback=="undefined"?TinCan.StatementsResult.fromJSON(c.responseText):b},_queryStatementsRequestCfg:function(a){this.log("_queryStatementsRequestCfg");var b={},c={url:"statements",method:"GET",params:b},d=["actor","object","instructor"],e=["verb"],f=["registration","context","since","until","limit","authoritative","sparse","ascending"],g;for(g=0;g<d.length;g+=1)typeof a.params[d[g]]!="undefined"&&(b[d[g]]=JSON.stringify(a.params[d[g]].asVersion(this.version)));for(g=0;g<e.length;g+=1)typeof a.params[e[g]]!="undefined"&&(b[e[g]]=a.params[e[g]].id);for(g=0;g<f.length;g+=1)typeof a.params[f[g]]!="undefined"&&(b[f[g]]=a.params[f[g]]);return c},moreStatements:function(a){this.log("moreStatements: "+a.url);var b,c,d,e;if(!TinCan.environment().isBrowser){this.log("error: environment not implemented");return}a=a||{},e=TinCan.Utils.parseURL(a.url),b={method:"GET",url:e.path,params:e.params},typeof a.callback!="undefined"&&(d=function(b){var c=TinCan.StatementsResult.fromJSON(b.responseText);a.callback(c)},b.callback=d),c=this.sendRequest(b);if(typeof b.callback=="undefined")return TinCan.StatementsResult.fromJSON(c.responseText)},retrieveState:function(a,b){this.log("retrieveState");var c={},d={},e;if(!TinCan.environment().isBrowser){this.log("error: environment not implemented");return}return c={stateId:a,activityId:b.activity.id},this.version==="0.90"?c.actor=JSON.stringify(b.agent.asVersion(this.version)):c.agent=JSON.stringify(b.agent.asVersion(this.version)),typeof b.registration!="undefined"&&(c.registrationId=b.registration),d={url:"activities/state",method:"GET",params:c},typeof b.callback!="undefined"&&(d.callback=b.callback),e=this.sendRequest(d),e.responseText},saveState:function(a,b,c){this.log("saveState");var d,e,f;if(!TinCan.environment().isBrowser){this.log("error: environment not implemented");return}return typeof b=="object"&&(b=JSON.stringify(b)),d={stateId:a,activityId:c.activity.id},this.version==="0.90"?d.actor=JSON.stringify(c.agent.asVersion(this.version)):d.agent=JSON.stringify(c.agent.asVersion(this.version)),typeof c.registration!="undefined"&&(d.registrationId=c.registration),e={url:"activities/state",method:"PUT",params:d,data:b},typeof c.callback!="undefined"&&(e.callback=c.callback),f=this.sendRequest(e),f.responseText},dropState:function(a,b){this.log("dropState");var c={},d={};if(!TinCan.environment().isBrowser){this.log("error: environment not implemented");return}c={activityId:b.activity.id},this.version==="0.90"?c.actor=JSON.stringify(b.agent.asVersion(this.version)):c.agent=JSON.stringify(b.agent.asVersion(this.version)),a!==null&&(c.stateId=a),typeof b.registration!="undefined"&&(c.registrationId=b.registration),d={url:"activities/state",method:"DELETE",params:c},typeof b.callback!="undefined"&&(d.callback=b.callback),this.sendRequest(d)},retrieveActivityProfile:function(a,b){this.log("retrieveActivityProfile");var c={},d;if(!TinCan.environment().isBrowser){this.log("error: environment not implemented");return}return c={url:"activities/profile",method:"GET",params:{profileId:a,activityId:b.activity.id}},typeof b.callback!="undefined"&&(c.callback=b.callback),d=this.sendRequest(c),d.responseText},saveActivityProfile:function(a,b,c){this.log("saveActivityProfile");var d;if(!TinCan.environment().isBrowser){this.log("error: environment not implemented");return}typeof b=="object"&&(b=JSON.stringify(b)),d={url:"activities/profile",method:"PUT",params:{profileId:a,activityId:c.activity.id},data:b},typeof c.callback!="undefined"&&(d.callback=c.callback),this.sendRequest(d)},dropActivityProfile:function(a,b){this.log("dropActivityProfile");var c={},d={};if(!TinCan.environment().isBrowser){this.log("error: environment not implemented");return}c={activityId:b.activity.id},a!==null&&(c.profileId=a),d={url:"activities/profile",method:"DELETE",params:c},typeof b.callback!="undefined"&&(d.callback=b.callback),this.sendRequest(d)},__delay:function(){var a=new XMLHttpRequest,b=window.location+"?forcenocache="+TinCan.Utils.getUUID();a.open("GET",b,!1),a.send(null)}}}(),function(){"use strict";var a=TinCan.AgentAccount=function(a){this.log("constructor"),this.homePage=null,this.name=null,this.init(a)};a.prototype={LOG_SRC:"AgentAccount",log:TinCan.prototype.log,init:function(a){this.log("init");var b,c=["name","homePage"],d;a=a||{},typeof a.accountServiceHomePage!="undefined"&&(a.homePage=a.accountServiceHomePage),typeof a.accountName!="undefined"&&(a.name=a.accountName);for(b=0;b<c.length;b+=1)a.hasOwnProperty(c[b])&&a[c[b]]!==null&&(this[c[b]]=a[c[b]])}}}(),function(){"use strict";var a=TinCan.Agent=function(a){this.log("constructor"),this.name=null,this.mbox=null,this.mbox_sha1sum=null,this.openid=null,this.account=null,this.degraded=!1,this.init(a)};a.prototype={objectType:"Agent",LOG_SRC:"Agent",log:TinCan.prototype.log,init:function(a){this.log("init");var b,c=["name","mbox","mbox_sha1sum","openid"],d;a=a||{};if(typeof a.lastName!="undefined"||typeof a.firstName!="undefined")a.name="",typeof a.firstName!="undefined"&&a.firstName.length>0&&(a.name=a.firstName[0],a.firstName.length>1&&(this.degraded=!0)),a.name!==""&&(a.name+=" "),typeof a.lastName!="undefined"&&a.lastName.length>0&&(a.name+=a.lastName[0],a.lastName.length>1&&(this.degraded=!0));else if(typeof a.familyName!="undefined"||typeof a.givenName!="undefined")a.name="",typeof a.givenName!="undefined"&&a.givenName.length>0&&(a.name=a.givenName[0],a.givenName.length>1&&(this.degraded=!0)),a.name!==""&&(a.name+=" "),typeof a.familyName!="undefined"&&a.familyName.length>0&&(a.name+=a.familyName[0],a.familyName.length>1&&(this.degraded=!0));typeof a.name=="object"&&(a.name.length>1&&(this.degraded=!0),a.name=a.name[0]),typeof a.mbox=="object"&&(a.mbox.length>1&&(this.degraded=!0),a.mbox=a.mbox[0]),typeof a.mbox_sha1sum=="object"&&(a.mbox_sha1sum.length>1&&(this.degraded=!0),a.mbox_sha1sum=a.mbox_sha1sum[0]),typeof a.openid=="object"&&(a.openid.length>1&&(this.degraded=!0),a.openid=a.openid[0]),typeof a.account=="object"&&typeof a.account.homePage=="undefined"&&(a.account.length===0?delete a.account:(a.account.length>1&&(this.degraded=!0),a.account=a.account[0])),a.hasOwnProperty("account")&&(this.account=new TinCan.AgentAccount(a.account));for(b=0;b<c.length;b+=1)a.hasOwnProperty(c[b])&&a[c[b]]!==null&&(d=a[c[b]],c[b]==="mbox"&&d.indexOf("mailto:")===-1&&(d="mailto:"+d),this[c[b]]=d)},toString:function(a){return this.log("toString"),this.name!==null?this.name:this.mbox!==null?this.mbox.replace("mailto:",""):this.account!==null?this.account.name:""},asVersion:function(a){this.log("asVersion: "+a);var b={objectType:this.objectType};return a=a||TinCan.versions()[0],a==="0.90"?(this.mbox!==null&&(b.mbox=[this.mbox]),this.name!==null&&(b.name=[this.name])):(this.mbox!==null&&(b.mbox=this.mbox),this.name!==null&&(b.name=this.name)),b}},a.fromJSON=function(b){a.prototype.log("fromJSON");var c=JSON.parse(b);return new a(c)}}(),function(){"use strict";var a=TinCan.Group=function(a){this.log("constructor"),this.member=[],this.init(a)};a.prototype={objectType:"Group",LOG_SRC:"Group",log:TinCan.prototype.log,init:function(a){this.log("init")}}}(),function(){"use strict";var a={"http://adlnet.gov/expapi/verbs/experienced":"experienced","http://adlnet.gov/expapi/verbs/attended":"attended","http://adlnet.gov/expapi/verbs/attempted":"attempted","http://adlnet.gov/expapi/verbs/completed":"completed","http://adlnet.gov/expapi/verbs/passed":"passed","http://adlnet.gov/expapi/verbs/failed":"failed","http://adlnet.gov/expapi/verbs/answered":"answered","http://adlnet.gov/expapi/verbs/interacted":"interacted","http://adlnet.gov/expapi/verbs/imported":"imported","http://adlnet.gov/expapi/verbs/created":"created","http://adlnet.gov/expapi/verbs/shared":"shared","http://adlnet.gov/expapi/verbs/voided":"voided"},b=TinCan.Verb=function(a){this.log("constructor"),this.id=null,this.display=null,this.init(a)};b.prototype={LOG_SRC:"Verb",log:TinCan.prototype.log,init:function(b){this.log("init");var c,d=["id","display"],e;if(typeof b=="string"){for(e in a)a.hasOwnProperty(e)&&a[e]===b&&(b=a[e]);this.id=b,this.display={und:this.id}}else{b=b||{};for(c=0;c<d.length;c+=1)b.hasOwnProperty(d[c])&&b[d[c]]!==null&&(this[d[c]]=b[d[c]])}},toString:function(a){return this.log("toString"),this.display!==null?this.getLangDictionaryValue("display",a):this.id},asVersion:function(b){this.log("asVersion");var c;return b=b||TinCan.versions()[0],b==="0.90"?c=a[this.id]:(c={id:this.id},this.display!==null&&(c.display=this.display)),c},getLangDictionaryValue:TinCan.Utils.getLangDictionaryValue},b.fromJSON=function(a){b.prototype.log("fromJSON");var c=JSON.parse(a);return new b(c)}}(),function(){"use strict";var a=TinCan.Result=function(a){this.log("constructor"),this.score=null,this.success=null,this.completion=null,this.duration=null,this.response=null,this.extensions=null,this.init(a)};a.prototype={LOG_SRC:"Result",log:TinCan.prototype.log,init:function(a){this.log("init");var b,c=["completion","duration","extensions","response","success"];a=a||{},a.hasOwnProperty("score")&&(this.score=new TinCan.Score(a.score));for(b=0;b<c.length;b+=1)a.hasOwnProperty(c[b])&&a[c[b]]!==null&&(this[c[b]]=a[c[b]])}},a.fromJSON=function(b){a.prototype.log("fromJSON");var c=JSON.parse(b);return new a(c)}}(),function(){"use strict";var a=TinCan.Score=function(a){this.log("constructor"),this.scaled=null,this.raw=null,this.min=null,this.max=null,this.init(a)};a.prototype={LOG_SRC:"Score",log:TinCan.prototype.log,init:function(a){this.log("init");var b,c=["scaled","raw","min","max"];a=a||{};for(b=0;b<c.length;b+=1)a.hasOwnProperty(c[b])&&a[c[b]]!==null&&(this[c[b]]=a[c[b]])}},a.fromJSON=function(b){a.prototype.log("fromJSON");var c=JSON.parse(b);return new a(c)}}(),function(){"use strict";var a=TinCan.Context=function(a){this.log("constructor"),this.registration=null,this.instructor=null,this.team=null,this.contextActivities={parent:null,grouping:null,other:null},this.revision=null,this.platform=null,this.language=null,this.statement=null,this.extensions=null,this.init(a)};a.prototype={LOG_SRC:"Context",log:TinCan.prototype.log,init:function(a){this.log("init");var b,c=["registration","instructor","team","revision","platform","language","statement","extensions"],d;a=a||{};for(b=0;b<c.length;b+=1)a.hasOwnProperty(c[b])&&a[c[b]]!==null&&(this[c[b]]=a[c[b]])}},a.fromJSON=function(b){a.prototype.log("fromJSON");var c=JSON.parse(b);return new a(c)}}(),function(){"use strict";var a=TinCan.Activity=function(a){this.log("constructor"),this.objectType="Activity",this.id=null,this.definition=null,this.init(a)};a.prototype={LOG_SRC:"Activity",log:TinCan.prototype.log,init:function(a){this.log("init");var b,c=["id"];a=a||{},a.hasOwnProperty("definition")&&(this.definition=new TinCan.ActivityDefinition(a.definition));for(b=0;b<c.length;b+=1)a.hasOwnProperty(c[b])&&a[c[b]]!==null&&(this[c[b]]=a[c[b]])},toString:function(a){this.log("toString");var b="";if(this.definition!==null){b=this.definition.toString(a);if(b!=="")return b}return this.id!==null?this.id:""},asVersion:function(a){this.log("asVersion");var b={id:this.id,objectType:this.objectType};return a=a||TinCan.versions()[0],this.definition!==null&&(b.definition=this.definition.asVersion(a)),b}},a.fromJSON=function(b){a.prototype.log("fromJSON");var c=JSON.parse(b);return new a(c)}}(),function(){"use strict";var a=TinCan.InteractionComponent=function(a){this.log("constructor"),this.id=null,this.description=null,this.init(a)};a.prototype={LOG_SRC:"InteractionComponent",log:TinCan.prototype.log,init:function(a){this.log("init");var b,c=["id","description"];a=a||{};for(b=0;b<c.length;b+=1)a.hasOwnProperty(c[b])&&a[c[b]]!==null&&(this[c[b]]=a[c[b]])},getLangDictionaryValue:TinCan.Utils.getLangDictionaryValue}}(),function(){"use strict";var a=TinCan.ActivityDefinition=function(a){this.log("constructor"),this.name=null,this.description=null,this.type=null,this.extensions=null,this.interactionType=null,this.correctResponsesPattern=null,this.choices=null,this.scale=null,this.source=null,this.target=null,this.steps=null,this.init(a)};a.prototype={LOG_SRC:"ActivityDefinition",log:TinCan.prototype.log,init:function(a){this.log("init");var b,c=["name","description","type","interactionType","extensions"];a=a||{},a.hasOwnProperty("definition")&&(this.definition=new TinCan.ActivityDefinition(a.definition));for(b=0;b<c.length;b+=1)a.hasOwnProperty(c[b])&&a[c[b]]!==null&&(this[c[b]]=a[c[b]])},toString:function(a){return this.log("toString"),this.name!==null?this.getLangDictionaryValue("name",a):this.description!==null?this.getLangDictionaryValue("description",a):""},asVersion:function(a){this.log("asVersion");var b={},c=["name","description","type","interactionType","extensions"],d;a=a||TinCan.versions()[0];for(d=0;d<c.length;d+=1)this[c[d]]!==null&&(b[c[d]]=this[c[d]]);return b},getLangDictionaryValue:TinCan.Utils.getLangDictionaryValue},a.fromJSON=function(b){a.prototype.log("fromJSON");var c=JSON.parse(b);return new a(c)}}(),function(){"use strict";var a=TinCan.StatementRef=function(a){this.log("constructor"),this.id=null,this.init(a)};a.prototype={objectType:"StatementRef",LOG_SRC:"StatementRef",log:TinCan.prototype.log,init:function(a){this.log("init");var b,c=["id"],d;a=a||{};for(b=0;b<c.length;b+=1)a.hasOwnProperty(c[b])&&a[c[b]]!==null&&(this[c[b]]=a[c[b]])},toString:function(a){return this.log("toString"),this.id},asVersion:function(a){return this.log("asVersion"),{objectType:this.prototype.objectType,id:this.id}}}}(),function(){"use strict";var a=TinCan.SubStatement=function(a){this.log("constructor"),this.actor=null,this.verb=null,this.target=null,this.result=null,this.context=null,this.timestamp=null,this.init(a)};a.prototype={objectType:"SubStatement",LOG_SRC:"SubStatement",log:TinCan.prototype.log,init:function(a){this.log("init");var b,c=["timestamp"],d;a=a||{},a.hasOwnProperty("object")&&(a.target=a.object),a.hasOwnProperty("actor")&&(this.actor=new TinCan.Agent(a.actor)),a.hasOwnProperty("verb")&&(this.verb=new TinCan.Verb(a.verb)),a.hasOwnProperty("target")&&(this.target=new TinCan.Activity(a.target)),a.hasOwnProperty("result")&&(this.result=new TinCan.Result(a.result));for(b=0;b<c.length;b+=1)a.hasOwnProperty(c[b])&&a[c[b]]!==null&&(this[c[b]]=a[c[b]])},toString:function(a){return this.log("toString"),(this.actor!==null?this.actor.toString(a):"")+" "+(this.verb!==null?this.verb.toString(a):"")+" "+(this.target!==null?this.target.toString(a):"")},asVersion:function(a){this.log("asVersion");var b;return a=a||TinCan.versions()[0],b={actor:this.actor.asVersion(a),verb:this.verb.asVersion(a),object:this.target.asVersion(a)},this.result!==null&&(b.result=this.result.asVersion(a)),b}}}(),function(){"use strict";var a=TinCan.Statement=function(a,b){this.log("constructor"),this.id=null,this.actor=null,this.verb=null,this.target=null,this.result=null,this.context=null,this.timestamp=null,this.stored=null,this.authority=null,this.voided=!1,this.degraded=!1,this.inProgress=null,this.originalJSON=null,b&&(this.originalJSON=JSON.stringify(a,null,b)),this.init(a)};a.prototype={LOG_SRC:"Statement",log:TinCan.prototype.log,init:function(a){this.log("init");var b,c=["id","stored","timestamp","inProgress","voided"],d;a=a||{},a.hasOwnProperty("object")&&(a.target=a.object);if(a.hasOwnProperty("actor")){if(typeof a.actor.objectType=="undefined"||a.actor.objectType==="Person")a.actor.objectType="Agent";a.actor.objectType==="Agent"?this.actor=new TinCan.Agent(a.actor):a.actor.objectType==="Group"&&(this.actor=new TinCan.Group(a.actor))}if(a.hasOwnProperty("authority")){if(typeof a.authority.objectType=="undefined"||a.authority.objectType==="Person")a.authority.objectType="Agent";a.authority.objectType==="Agent"?this.actor=new TinCan.Agent(a.actor):a.actor.objectType==="Group"&&(this.actor=new TinCan.Group(a.actor))}a.hasOwnProperty("verb")&&(this.verb=new TinCan.Verb(a.verb)),a.hasOwnProperty("target")&&(typeof a.target.objectType=="undefined"&&(a.target.objectType="Activity"),a.target.objectType==="Activity"?this.target=new TinCan.Activity(a.target):a.target.objectType==="Agent"?this.target=new TinCan.Agent(a.target):a.target.objectType==="SubStatement"?this.target=new TinCan.SubStatement(a.target):a.target.objectType==="StatementRef"?this.target=new TinCan.StatementRef(a.target):this.log("Unrecognized target type: "+a.target.objectType)),a.hasOwnProperty("result")&&(this.result=new TinCan.Result(a.result)),a.hasOwnProperty("context")&&(this.context=new TinCan.Context(a.context));for(b=0;b<c.length;b+=1)a.hasOwnProperty(c[b])&&a[c[b]]!==null&&(this[c[b]]=a[c[b]]);this.id===null&&(this.id=TinCan.Utils.getUUID()),this.timestamp===null&&(this.timestamp=TinCan.Utils.getISODateString(new Date))},toString:function(a){return this.log("toString"),(this.actor!==null?this.actor.toString(a):"")+" "+(this.verb!==null?this.verb.toString(a):"")+" "+(this.target!==null?this.target.toString(a):"")},asVersion:function(a){this.log("asVersion");var b,c=["id","timestamp","stored","voided"],d=["result","context","authority"],e;a=a||TinCan.versions()[0],b={actor:this.actor.asVersion(a),verb:this.verb.asVersion(a),object:this.target.asVersion(a)};for(e=0;e<c.length;e+=1)this[c[e]]!==null&&(b[c[e]]=this[c[e]]);for(e=0;e<d.length;e+=1)this[d[e]]!==null&&(b[d[e]]=this[d[e]].asVersion(a));return a==="0.90"&&this.inProgress!==null&&(b.inProgress=this.inProgress),b}}}(),function(){"use strict";var a=TinCan.StatementsResult=function(a){this.log("constructor"),this.statements=null,this.more=null,this.init(a)};a.prototype={LOG_SRC:"StatementsResult",log:TinCan.prototype.log,init:function(a){this.log("init"),a=a||{},a.hasOwnProperty("statements")&&(this.statements=a.statements),a.hasOwnProperty("more")&&(this.more=a.more)}},a.fromJSON=function(b){a.prototype.log("fromJSON");var c=JSON.parse(b),d=[],e,f;for(f=0;f<c.statements.length;f+=1){try{e=new TinCan.Statement(c.statements[f],4)}catch(g){a.prototype.log("fromJSON - statement instantiation failed: "+g+" ("+JSON.stringify(c.statements[f])+")"),e=new TinCan.Statement({id:c.statements[f].id},4)}d.push(e)}return c.statements=d,new a(c)}}(),function(){"use strict";var a=TinCan.State=function(a){this.log("constructor"),this.id=null,this.updated=null,this.contents=null,this.init(a)};a.prototype={LOG_SRC:"State",log:TinCan.prototype.log,init:function(a){this.log("init"),a=a||{}}},a.fromJSON=function(b){a.prototype.log("fromJSON");var c=JSON.parse(b);return new a(c)}}();
