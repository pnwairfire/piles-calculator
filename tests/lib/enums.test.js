import { ShapeTypes } from "../../src/lib/enums";

test("Shape validate throws exception on invalid shape", () => {
  const t = () => {
    ShapeTypes.validate('sdf')
  };

  expect(t).toThrow("Shape must be one of the following: HalfSphere, Paraboloid, HalfCylinder, HalfFrustumOfCone, HalfFrustumOfConeWithRoundedEnds, HalfEllipsoidIrregularSolid, Irregular")
});

test("Shape validate does nothing for valid shape", () => {
  ShapeTypes.validate('HalfSphere')
});
