import { PresentationLayout } from "./components/PresentationLayout";
import { MouseTrail } from "./components/MouseTrail";
import { Screen1 } from "./components/Screen1";
import { Screen2 } from "./components/Screen2";
import { Screen6 } from "./components/Screen6";
import { Screen7 } from "./components/Screen7";

function App() {
  return (
    <>
      <MouseTrail />
      <PresentationLayout>
        <Screen1 />
        <Screen2 />
        <Screen7 />
        <Screen6 />
      </PresentationLayout>
    </>
  );
}

export default App;