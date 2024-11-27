import { ShapeTypes } from "../../src/lib/enums";
import { Shape } from "../../src/lib/shape";

test("Inavalid shape type", () => {
  const t = () => {
    new Shape('sdf')
  };

  expect(t).toThrow("Shape must be one of the following: HalfSphere, Paraboloid, HalfCylinder, HalfFrustumOfCone, HalfFrustumOfConeWithRoundedEnds, HalfEllipsoidIrregularSolid, Irregular")
});


/* Invalid HelfSphere*/

test("h1 not specified for HalfSphere", () => {
  const t = () => {
    new Shape(ShapeTypes.HalfSphere, {})
  }

  expect(t).toThrow("Specify a positive number for h1")
});

test("Invalid string value for h1  HalfSphere", () => {
  const t = () => {
    new Shape(ShapeTypes.HalfSphere, {h1: "sdf"})
  }

  expect(t).toThrow("Specify a positive number for h1")
});

test("Invalid negative number for h1 HalfSphere", () => {
  const t = () => {
    new Shape(ShapeTypes.HalfSphere, {h1: -23})
  }

  expect(t).toThrow("Specify a positive number for h1")
});


/* Invalid Paraboloid */

test("h1 and w1 not specified for Paraboloid", () => {
  const t = () => {
    new Shape(ShapeTypes.Paraboloid, {})
  }

  expect(t).toThrow("Specify positive numbers for h1, w1")
});

test("Invalid string value for h1 and w1 not specified for Paraboloid", () => {
  const t = () => {
    new Shape(ShapeTypes.Paraboloid, {h1: "sdf"})
  }

  expect(t).toThrow("Specify positive numbers for h1, w1")
});

test("Invalid negative number for h1 and w1 not specified for Paraboloid", () => {
  const t = () => {
    new Shape(ShapeTypes.Paraboloid, {h1: -23})
  }

  expect(t).toThrow("Specify positive numbers for h1, w1")
});

test("Valid h1 but w1 not specified for Paraboloid", () => {
  const t = () => {
    new Shape(ShapeTypes.Paraboloid, {h1: 3})
  }

  expect(t).toThrow("Specify a positive number for w1")
});

test("Valid h1 but invalid string w1 specified for Paraboloid", () => {
  const t = () => {
    new Shape(ShapeTypes.Paraboloid, {h1: 3, w1: 'sdf'})
  }

  expect(t).toThrow("Specify a positive number for w1")
});

test("Valid h1 but invalid negative w1 specified for Paraboloid", () => {
  const t = () => {
    new Shape(ShapeTypes.Paraboloid, {h1: 3, w1: -1})
  }

  expect(t).toThrow("Specify a positive number for w1")
});


/* Valid Shapes */

