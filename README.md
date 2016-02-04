# Netmask Privacy Plugin for Firefox
Automates the mangagement and setting of hidden firefox privacy parameters for maximum browser safety.

## Installation Instructions

This plugin can be found in the [Firefox marketplace](https://addons.mozilla.org/en-US/firefox/addon/netmasked/), or by searching "Netmasked"

Once installed, the add in will help give you fine grained control and advice to manage the hidden parameters of the browser to improve overall privacy.

Some of the settings that are manageable:
 * Block WebRTC, which can be used to get a real IP address, even when using a VPN.
 * Disable sending of information to third parties like Google (for virus checking)
 * Disable sockets and pings (which can break some applications)
 * Set up general parameters for protection, and preventing sites from bypassing some filters.

### Full list of hidden settings that can be controlled:

 If you think I missed something, please submit an issue or a pull request with the explanation.

  * media.peerconnection.enabled
  * media.peerconnection.use_document_iceservers
  * media.peerconnection.video.enabled
  * media.peerconnection.identity.timeout
  * privacy.trackingprotection.enabled
  * geo.enabled
  * geo.wifi.logging.enabled
  * browser.safebrowsing.enabled
  * browser.safebrowsing.malware.enabled
  * dom.event.clipboardevents.enabled
  * dom.event.contextmenu.enable
  * browser.send_pings
  * network.websocket.enabled
  * webgl.disabled


## Screenshot of the installed plugin:

 ![Netmasker Privacy Plugin Screenshot](/screenshots/netmasker_screen_shot.png?raw=true "Installed Plugin")

## Manual Install

If you don't wish to download the plugin from the Firefox marketplace, download the complete
package. Open the FireFox extensions window, and click settings->install add-in from file.

Browse to the unzipped directory, find the .xpi file, and load it. 

Loading the extension does not require a restart of the browser.
