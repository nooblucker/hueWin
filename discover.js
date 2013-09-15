// using jQuery v2.x because 1.x does not work for win8

var HUE_MODEL_NAME = "Philips hue bridge 2012";
var bridges = [];

var discoverBridges = function (options) {

    var settings = {
        timeout: 1200,
        callback: function (bridges) {
            bridges.forEach(function (bridge) {
                console.log(bridge);
            });
        }
    };
    $.extend(true, settings, options);

    var socket = new Windows.Networking.Sockets.DatagramSocket();
    socket.addEventListener("messagereceived", onMessageReceived);

    var hostName = new Windows.Networking.HostName("239.255.255.250");
    socket.getOutputStreamAsync(hostName, "1900").done(sendDiscoveryMessage);

    if (settings.timeout > 0 && $.isFunction(settings.callback)) {
        setTimeout(function () {
            settings.callback(bridges);
        }, settings.timeout);
    }
};

var onMessageReceived = function (eventArgument) {
    try {
        var reader = eventArgument.getDataReader();
        var messageLength = reader.unconsumedBufferLength;
        var message = reader.readString(messageLength);
        var location = getLocationFromSSDPResponse(message);
        checkForBridge(location, handleBridge);
    } catch (exception) {
        var output = $("#output");
        var status = Windows.Networking.Sockets.SocketError.getStatus(exception.number);
        if (status === Windows.Networking.Sockets.SocketErrorStatus.connectionResetByPeer) {
            output.append("Peer does not listen on the specific port. Please make sure that you run step 1 first " +
            "or you have a server properly working on a remote server.");
        } else {
            output.append("Error happened when receiving a datagram: " + exception.message);
        }
    }
};

var getLocationFromSSDPResponse = function (responseText) {
    var locationRegex = /LOCATION\: (\S+)/;
    locationRegex.exec(responseText);
    return RegExp.$1;
};

var checkForBridge = function (location, callback) {
    $.get(location, function (xml) {
        var $xml = $(xml);
        var modelName = $xml.find("modelName").text();
        var isBridge = modelName && HUE_MODEL_NAME === modelName;
        if (isBridge) {
            var bridge = $xml.find("URLBase").text();
            callback(null, bridge);
        } else {
            callback("not a bridge");
        }
    });
};

var handleBridge = function (err, bridge) {
    if (err) {
        console.log(location + ": " + err);
    } else {
        addBridge(bridge);
    }
};

var addBridge = function (bridge) {
    if (bridgeIsNew(bridge)) {
        bridges.push(bridge);
    }
};

var bridgeIsNew = function (bridge) {
    return bridges.indexOf(bridge) < 0;
};

var sendDiscoveryMessage = function (stream) {
    var writer = new Windows.Storage.Streams.DataWriter(stream);
    writer.unicodeEncoding = Windows.Storage.Streams.UnicodeEncoding.utf8;
    var ssdpMessage =   "M-SEARCH * HTTP/1.1\r\n" + 
                        "HOST: 239.255.255.250:1900\r\n" + 
                        "ST:upnp:rootdevice\r\n" + 
                        "MAN:\"ssdp:discover\"\r\n" + 
                        "MX:3\r\n\r\n";
    writer.writeString(ssdpMessage);
    writer.storeAsync();
};