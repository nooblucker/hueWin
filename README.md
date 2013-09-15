# hueWin

## Philips Hue Bridge UPnP discovery via UDP datagram socket (SSDP) for a windows 8 store app written in JavaScript

see discover.js for a working example to locate philips hue bridges in your network with a windows 8 store app. the baseURLs of the bridges are stored in an array, like
`var bridges = [ "http://192.168.1.10:80/" ];`

then you can connect to the API and do whatever you want.