import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);

// import { createRoot } from "react-dom/client";

// function Box({ children }) {
//   console.log(children)
//   return (
//     <>
//       <h1>Box</h1>
//       {children}
//     </>
//   );
// }

// function Child1() {
//   return (
//     <>
//       <h1>Child 1</h1>
//     </>
//   );
// }

// function Child2() {
//   return (
//     <>
//       <h1>Child 2</h1>
//     </>
//   );
// }

// createRoot(document.getElementById("root")).render(
//   <Box>
//     <Child1></Child1>
//     <Child2></Child2>
//   </Box>,
// );
