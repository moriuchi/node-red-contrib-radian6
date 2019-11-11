node-red-contrib-radian6
========================

[**Japanese**](./README_ja.md)

A collection of <a href="http://nodered.org" target="_new">Node-RED</a> nodes for <a href="http://www.exacttarget.com/products/social-media-marketing/radian6" target="_new">radian6</a>.

[![NPM](https://nodei.co/npm/node-red-contrib-radian6.png?downloads=true)](https://nodei.co/npm/node-red-contrib-radian6/)

Pre-requisites
-------

The node-red-contrib-radian6 requires <a href="http://nodered.org" target="_new">Node-RED</a> to be installed.

Install
-------

Run the following command in the root directory of your Node-RED install

    npm install node-red-contrib-radian6

Restart your Node-RED instance, the radian6 node appears in the palette and ready for use.

Overview
-------

node-red-contrib-radian6 uses the Radian6 API to get post data from the topic profile.

Parameters such as the media type and target time for obtaining post data are specified in the node settings.

Radian6 API returns the acquired data in XML, but node-red-contrib-radian6 converts to a JSON object and outputs <code>msg.payload</code>, so there is no need to convert it on the flow.


Acknowledgements
----------------

The node-red-contrib-radian6 uses the following open source software:

- [Requet] (https://github.com/request/request): Simplified HTTP request client.
- [node-xml2js] (https://github.com/Leonidas-from-XIV/node-xml2js): Simple XML to JavaScript object converter. It supports bi-directional conversion. Uses sax-js and xmlbuilder-js.

License
-------

See [license] (https://github.com/joeartsea/node-red-contrib-radian6/blob/master/LICENSE) (Apache License Version 2.0).

Contributing
-------

Both submitting issues to [GitHub issues](https://github.com/joeartsea/node-red-contrib-radian6/issues) and Pull requests are welcome to contribute.


Developers
-------

If the developer wants to modify the source of node-red-contrib-radian6, run the following code to create a clone.

```
cd ~\.node-red\node_modules
git clone https://github.com/joeartsea/node-red-contrib-radian6.git
cd node-red-contrib-radian6
npm install
```

