function createEnum(name, values) {
  const obj = {};
  for (const val of values) {
    obj[val] = val;
  }
  obj.keys = values
  obj.validate = key => {
    if (values.indexOf(key) < 0)
      throw `${name} must be one of the following: ${values.join(', ')}`
  }
  return Object.freeze(obj);
}

export const ShapeTypes = createEnum('Shape', [
  'HalfSphere', 'Paraboloid', 'HalfCylinder', 'HalfFrustumOfCone',
  'HalfFrustumOfConeWithRoundedEnds', 'HalfEllipsoidIrregularSolid'
]);

export const UnitSystems = createEnum('Unit System', [
    'English', 'Metric'
])
