var data = require("sdk/self").data;
var preferences = require('sdk/preferences/service');
var { when: unload } = require("sdk/system/unload");

//object to hold all the preference data we care about
var privacy_preferences = {};

//WebRTC and related settings
privacy_preferences.webRTC = {};
privacy_preferences.webRTC.key = 'media.peerconnection.enabled'
privacy_preferences.webRTC.name = "WebRTC"
privacy_preferences.webRTC.description = "Allows JavaScript to access your IP without any prompts. It can be used to leak your IP address even while using a VPN."
privacy_preferences.webRTC.default = true
privacy_preferences.webRTC.suggested = false

privacy_preferences.webRTC_doc_iceservers = {};
privacy_preferences.webRTC_doc_iceservers.key = 'media.peerconnection.use_document_iceservers'
privacy_preferences.webRTC_doc_iceservers.name = "WebRTC Document ice servers"
privacy_preferences.webRTC_doc_iceservers.description = "Allows JavaScript to access your IP without any prompts. It can be used to leak your IP address even while using a VPN."
privacy_preferences.webRTC_doc_iceservers.default = true
privacy_preferences.webRTC_doc_iceservers.suggested = false

privacy_preferences.webRTC_video = {};
privacy_preferences.webRTC_video.key = 'media.peerconnection.video.enabled'
privacy_preferences.webRTC_video.name = "WebRTC Video"
privacy_preferences.webRTC_video.description = "Allows JavaScript to access your IP without any prompts. It can be used to leak your IP address even while using a VPN."
privacy_preferences.webRTC_video.default = true
privacy_preferences.webRTC_video.suggested = false

privacy_preferences.webRTC_identity = {};
privacy_preferences.webRTC_identity.key = 'media.peerconnection.identity.timeout'
privacy_preferences.webRTC_identity.name = "WebRTC Identity timeout"
privacy_preferences.webRTC_identity.description = "Allows WebRTC services to store your identity"
privacy_preferences.webRTC_identity.default = 10000
privacy_preferences.webRTC_identity.suggested = 1

//Mozilla tracking protection
privacy_preferences.tracking_protection = {};
privacy_preferences.tracking_protection.key = 'privacy.trackingprotection.enabled'
privacy_preferences.tracking_protection.name = "Mozilla tracking protection"
privacy_preferences.tracking_protection.description = "Enable this for Mozillas tracking protection"
privacy_preferences.tracking_protection.default = false
privacy_preferences.tracking_protection.suggested = true

//GEO tracking
privacy_preferences.geo = {};
privacy_preferences.geo.key = 'geo.enabled'
privacy_preferences.geo.name = "GEO"
privacy_preferences.geo.description = "Geo tracking sends location information to websites"
privacy_preferences.geo.default = true
privacy_preferences.geo.suggested = false

privacy_preferences.geo_wifi = {};
privacy_preferences.geo_wifi.key = 'geo.wifi.logging.enabled'
privacy_preferences.geo_wifi.name = "GEO for wifi"
privacy_preferences.geo_wifi.description = "Geo tracking sends location information to websites"
privacy_preferences.geo_wifi.default = undefined
privacy_preferences.geo_wifi.suggested = false

//Sending data to google
privacy_preferences.safebrowsing = {};
privacy_preferences.safebrowsing.key = 'browser.safebrowsing.enabled'
privacy_preferences.safebrowsing.name = "Google Safe Browsing"
privacy_preferences.safebrowsing.description = "Sends sites you visit to Google. Disabling this slightly decreases security."
privacy_preferences.safebrowsing.default = true
privacy_preferences.safebrowsing.suggested = false

privacy_preferences.safebrowsing_malware = {};
privacy_preferences.safebrowsing_malware.key = 'browser.safebrowsing.malware.enabled'
privacy_preferences.safebrowsing_malware.name = "Google Safe Browsing Malware"
privacy_preferences.safebrowsing_malware.description = "Sends sites you visit to Google. Disabling this slightly decreases security."
privacy_preferences.safebrowsing_malware.default = true
privacy_preferences.safebrowsing_malware.suggested = false

//Click control
privacy_preferences.clipboard = {};
privacy_preferences.clipboard.key = 'dom.event.clipboardevents.enabled'
privacy_preferences.clipboard.name = "Clipboard events"
privacy_preferences.clipboard.description = "Sends data about what you click, copy, and paste from a site"
privacy_preferences.clipboard.default = true
privacy_preferences.clipboard.suggested = false

privacy_preferences.rightclick = {};
privacy_preferences.rightclick.key = 'dom.event.contextmenu.enable'
privacy_preferences.rightclick.name = "Right Click Control"
privacy_preferences.rightclick.description = "Gives a site control over your right click menu"
privacy_preferences.rightclick.default = undefined
privacy_preferences.rightclick.suggested = false

//Browser pings
privacy_preferences.pings = {};
privacy_preferences.pings.key = 'browser.send_pings'
privacy_preferences.pings.name = "Pings"
privacy_preferences.pings.description = "Allows sites to track visitor clicks"
privacy_preferences.pings.default = true
privacy_preferences.pings.suggested = false

//websocket
privacy_preferences.websocket = {};
privacy_preferences.websocket.key = 'network.websocket.enabled'
privacy_preferences.websocket.name = "Websockets"
privacy_preferences.websocket.description = "Allows sites to directly connect to your PC. May be used by some support programs"
privacy_preferences.websocket.default = undefined
privacy_preferences.websocket.suggested = false

//webGL
privacy_preferences.webGL = {};
privacy_preferences.webGL.key = 'webgl.disabled'
privacy_preferences.webGL.name = "WebGL"
privacy_preferences.webGL.description = "WebGL is currently a security risk, though may be required for browser games."
privacy_preferences.webGL.default = false
privacy_preferences.webGL.suggested = true

function load_current_preference_values() {
    for( var pref in privacy_preferences) {
        var key = privacy_preferences[pref]['key'];
        privacy_preferences[pref]['current_value'] = preferences.get(key);
    }
}

var config_box = require("sdk/panel").Panel( {
    width: 400,
    height: 400,
    contentURL: data.url("options.html"),
    contentScriptFile: data.url("options.js")
});

var button = require('sdk/ui/button/action').ActionButton({
    id: "privacy-recs",
    label: "Netmasker",
    icon: {
        "16": "./icon-16.png",
        "32": "./icon-32.png",
        "64": "./icon-64.png"
    },
    onClick: handleClick
});

function handleClick(state) {
    config_box.show({
        position: button,
    });
}

config_box.on("show", function() {
    config_box.port.emit("show");
});

function getPreferences() {
    load_current_preference_values();
    config_box.port.emit("get-preferences", privacy_preferences);
}

function setPreferenceValue(key, value) {
    if (value == undefined)
        preferences.reset(key)
    else
        preferences.set(key, value);
}

config_box.port.on("get-preferences", getPreferences);
config_box.port.on("set-preference", setPreferenceValue);
config_box.port.on("reset-all", restore_default_preference_values);
config_box.port.on("set-all", set_all_recommended_preference_values);

//Restore the default FF values
function restore_default_preference_values() {
    load_current_preference_values();
    for( var pref in privacy_preferences) {
        var key = privacy_preferences[pref]['key'];
        var default_value = privacy_preferences[pref]['default'];
        var current_value = privacy_preferences[pref]['current_value'];
        var suggested_value = privacy_preferences[pref]['suggested'];
        //Don't reset any preferences with a custom value
        if (current_value == suggested_value) {
            setPreferenceValue(key, default_value);
        }
    }
}

//Set every value to recommended
function set_all_recommended_preference_values() {
    for( var pref in privacy_preferences) {
        var key = privacy_preferences[pref]['key'];
        var suggested_value = privacy_preferences[pref]['suggested'];
        setPreferenceValue(key, suggested_value)
    }
}

//restore deaults on unload
exports.onUnload = function (reason) {
    if reason == "uninstall" || reason == "disable" {
        restore_default_preference_values();
    }
};
