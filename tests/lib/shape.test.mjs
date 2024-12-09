import { ShapeTypes } from "../../src/lib/enums.mjs";
import { Shape } from "../../src/lib/shape.mjs";

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

test("Valid HalfSphere", () => {
  const p = new Shape(ShapeTypes.HalfSphere, {h1: 3})
  expect(p.volume).toBe(14.137166941154069)
});

test("Valid Paraboloid", () => {
  const p = new Shape(ShapeTypes.Paraboloid, {h1: 3, w1: 4})
  expect(p.volume).toBe(18.84955592153876)
});

test("Valid HalfCylinder", () => {
  const p = new Shape(ShapeTypes.HalfCylinder, {h1: 3, w1: 4, l1: 5})
  expect(p.volume).toBe(47.12388980384689)
});

test("Valid HalfFrustumOfCone", () => {
  const p = new Shape(ShapeTypes.HalfFrustumOfCone, {w1: 4, w2: 6, l1:3})
  expect(p.volume).toBe(29.845130209103033)
});

test("Valid HalfFrustumOfConeWithRoundedEnds", () => {
  const p = new Shape(ShapeTypes.HalfFrustumOfConeWithRoundedEnds, {w1: 4, w2: 6, l1:3})
  expect(p.volume).toBe(66.49704450098396)
});

test("Valid HalfEllipsoidIrregularSolid", () => {
  const p = new Shape(ShapeTypes.HalfEllipsoidIrregularSolid, {h1: 3, w1: 4, l1: 5})
  expect(p.volume).toBe(31.415926535897928)
});

test("valid Irregular", () => {
  const p = new Shape(ShapeTypes.Irregular, {h1: 3, w1: 4, l1: 5, h2: 6, w2: 7, l2: 8})
  expect(p.volume).toBe(160.875)
});
