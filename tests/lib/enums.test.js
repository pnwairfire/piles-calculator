import { Shapes } from "../../src/lib/enums";

test("Shape validate throws exception on invalid shape", () => {
  const t = () => {
    Shapes.validate('sdf')
  };

  expect(t).toThrow("Shape must be one of the following: HalfSphere, Paraboloid, HalfCylinder, Half-FrustumOfCone, HalfFrustumOfConeWithRoundedEnds, HalfEllipsoidIrregularSolid")
});

test("Shape validate does nothing for valid shape", () => {
  Shapes.validate('HalfSphere')
});
