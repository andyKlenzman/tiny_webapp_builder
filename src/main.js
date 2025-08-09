import renderApp from "./controller/controller";
import { mountLoginGate } from "./controller/auth";
const root = document.body
mountLoginGate({
  root,
  onReady: () => renderApp(),
});
