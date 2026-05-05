import { createBrowserRouter } from "react-router";
import HomePage from "./components/HomePage";
import AcesUpGame from "./components/AcesUpGame";
import SolitaireGame from "./components/SolitaireGame";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/aces-up",
    Component: AcesUpGame,
  },
  {
    path: "/solitaire",
    Component: SolitaireGame,
  },
]);
