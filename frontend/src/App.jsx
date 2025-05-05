import "./App.css";
import AllRoutes from "./customComponents/AllRoutes";
import { Toaster } from "sonner";

function App() {
  return (
    <div>
      <AllRoutes />
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default App;
