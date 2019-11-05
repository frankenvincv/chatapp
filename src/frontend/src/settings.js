let DEBUG = true;
let HOST_URL = "https://justdjango-chat.herokuapp.com";
let SOCKET_URL = "wss://justdjango-chat.herokuapp.com";
let IMG_URL = "http://emilcarlsson.se/assets/mikeross.png";
if (DEBUG) {
  HOST_URL = "http://192.168.69.108:8000";
  SOCKET_URL = "ws://192.168.69.108:8000";
}
export { HOST_URL, SOCKET_URL,IMG_URL };
