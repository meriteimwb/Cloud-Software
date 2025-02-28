
// const mqttUrl = "http://65.0.94.47:80";
// const mqttUrl = "http://192.168.1.145:80";
const mqttUrl = "http://10.60.200.217:80";
//const mqttUrl = "http://10.60.200.209:80";

var mqtt = require("mqtt");
var options = {
  protocol: "ws",
  keepalive: 20,
  // clientId uniquely identifies client
  // choose any string you wish
  clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
  //proxy: {
  //  host: "172.16.1.61",
  //  port: 8080,
  //  proxyType: "socks"
  //}
  //proxy: {
  //  host: "10.77.40.15",
  //  port: 3128,
  //  proxyType: "socks"
  //}
};

function getclient(params) {
    const client = mqtt.connect(mqttUrl, options);
    client.stream.on("error", (err) => {
        // errorHandler(`Connection to ${mqttUrl} failed`);
        console.log("Connection error");
        console.log(err);
        client.end();
    });
    client.on('connect', () => {
        console.log(mqttUrl);
        console.log("connected Successfully");
    });
    client.on('packetsend', (event) => {
        console.log(event);
        console.log("Published Successfully");
    });
    return client;
}

function subscribe(client, topic, subHandler) {
    const callBack = (err, granted) => {
        if (err) {
            console.log("Subscription request failed");
        } else {
            console.log("Subscribed to " + topic);
            subHandler(topic)
        }
    };
    return client.subscribe(topic, callBack);
}

function onMessage(client, callBack) {
    client.on('message', (topic, message, packet) => {
        const json_response = JSON.parse(new TextDecoder("utf-8").decode(message));
        if (json_response['Message'] === 'UnknownVehicle') {
            unsubscribe(client, topic);
        }
        callBack(json_response, topic, client);
    });
}

function unsubscribe(client, topic) {
    console.log("inside Unsubscribing : " + topic);
    if (client) {
        client.unsubscribe(topic, function (error) {
            if (error) {
              console.log(error);
            } else {
              console.log('Unsubscribed');
            }
        });
    } else {
        console.log("Client is null");
    }
}

function closeConnection(client) {
    client.end();
}

function publish(client, topic, message) {
    try {
        console.log("Publishing to " + topic + " & Message is : " + message);
        console.log(client.connected);
        client.publish(topic, message, error => {
            if (error) {
                console.log('Publish error: ', error);
                // if (client.connected === false) {
                //     client.reconnect()
                // }
            } else {
                console.log("Hello");
            }
        });
    } catch (error) {
        console.log(error);
    }
}

const MqttService = {
    getclient,
    subscribe,
    onMessage,
    publish,
    unsubscribe,
    closeConnection,
}

export default MqttService;
