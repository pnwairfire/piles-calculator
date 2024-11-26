import { calcPiles } from "../src/index";

test("returns 1", () => {
  //console.log = jest.fn();
  const r = calcPiles();
  expect(r).toBe(1)
  //expect(console.log).toHaveBeenCalledWith("Hello, world!");
});
