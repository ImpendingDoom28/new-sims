import { io } from "socket.io-client";

// FIXME: hard-coded url
export const socket = io(
  `http://${
    typeof window !== "undefined" ? window.location.hostname : "localhost"
  }:5050`,
  {
    closeOnBeforeunload: true,
  }
);
