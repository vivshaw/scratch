import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders without crashing", async () => {
  const { unmount } = render(<App />);
  unmount();
});
