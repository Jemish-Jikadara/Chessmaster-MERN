import { io } from 'socket.io-client';

const SOCKET_URL = 'https://chess-master-algd.onrender.com/';

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: true,
    });
  }
  return socket;
}

export default getSocket;
