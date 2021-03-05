import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

test("renders without crashing", async () => {
  const { unmount } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  await screen.findAllByText("Scratch");

  unmount();
});
