// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { setupAws } from "./libs/awsLib";

// By setting up Amplify here, we can use it in all tests instead of mocking it.
setupAws();
