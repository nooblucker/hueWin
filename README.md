# hueWin

## Philips Hue Bridge UPnP discovery via UDP datagram socket (SSDP) for a windows 8 store app written in JavaScript

see discover.js for a working example to locate philips hue bridges in your network with a windows 8 store app. the baseURLs of the bridges are returned as an array.
```
discoverBridges({
	timeout: 1200, // wait 1.2 seconds for all devices to respond to the ssdp
	callback: function(bridges) {
		// e.g. bridges[0] = "http://your-ip:80/"
	}
});
```

then you can connect to the API and do whatever you want.

[jQuery 2.x](http://code.jquery.com/jquery-2.0.3.min.js) is used in this code.

# credits
* [Lewis Benge](http://www.lewisbenge.net/index.php/2012/11/device-discovery-ssdp-in-windows-8-and-winrt/) described how he discovers his Samsung SmartTV with C# and this helped me a lot to get started