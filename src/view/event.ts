import browser from "webextension-polyfill";
import {
  AppEvent,
  AskProcessor,
  PopUpEventEmitter,
  RESPONSE,
} from "../libs/event";
import { EventEmitter } from "../libs/eventEmitter";

let port: browser.Runtime.Port;

export const uiEventEmitter: PopUpEventEmitter = new EventEmitter();

export const sendBackground: AskProcessor<void> = {
  message: (method, params) => {
    port.postMessage({ method, params });
  },
};

export const askBackground = <R>(): AskProcessor<Promise<R>> => {
  return {
    message: (method, params) => {
      const id = Date.now();
      port.postMessage({ method, id, params: params });
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          port.onMessage.removeListener(handler);
          reject("Timeout");
        }, 5000);

        const handler = (message: AppEvent<string, R>) => {
          if (message.method === RESPONSE && message.id === id) {
            clearTimeout(timer);
            resolve(message.params);
          }
        };

        port.onMessage.addListener(handler);
      });
    },
  };
};

export const connectToBackground = () => {
  port = browser.runtime.connect({ name: "TonMaskUI" });

  port.onMessage.addListener((data) => {
    uiEventEmitter.emit<any>(data.method, data);
  });

  port.onDisconnect.addListener(() => {
    connectToBackground();
  });
};