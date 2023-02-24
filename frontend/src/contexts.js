import React, { createContext } from 'react'

// const SocketContext = createContext(null)
import io from "socket.io-client";
// import { SOCKET_URL } from "config";
let SERVER = null;

SERVER = "http://localhost:3001";



const socket = io.connect(SERVER);
//console.log("main socket is")
//console.log(socket)

function socketConfiguration() {

    socket.on("connection", () => {
    })


    // setSocket(socket)
    //console.log(socket)
}
socketConfiguration()

const UserContext = createContext(null)
const SocketContext = createContext(socket);
const LoggedInContext = createContext(undefined)
export {
    UserContext,
    SocketContext,
    socket,
    LoggedInContext
}