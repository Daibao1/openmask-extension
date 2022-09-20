import { Route, Routes } from "react-router-dom";
import { Loading } from "../Loading";
import { ConnectDApp } from "./connect/ConnectDApp";
import { SwitchNetwork } from "./switch/SwitchNetwork";

enum NotificationRoutes {
  network = "/network",
  dapp = "/dapp",
  unlock = "/unlock",
}

export const Notification = () => {
  return (
    <Routes>
      <Route path={NotificationRoutes.network} element={<SwitchNetwork />} />
      <Route path={NotificationRoutes.dapp} element={<ConnectDApp />} />
      <Route path={NotificationRoutes.unlock} element={<Loading />} />
    </Routes>
  );
};