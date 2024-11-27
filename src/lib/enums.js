function createEnum(name, values) {
  const obj = {};
  for (const val of values) {
    obj[val] = val;
  }
  obj.values = values
  obj.validate = key => {
    if (values.indexOf(key) < 0)
      throw `${name} must be one of the following: ${values.join(', ')}`
  }
  return Object.freeze(obj);
}

export const ShapeTypes = createEnum('Shape', [
  'HalfSphere', 'Paraboloid', 'HalfCylinder', 'HalfFrustumOfCone',
  'HalfFrustumOfConeWithRoundedEnds', 'HalfEllipsoidIrregularSolid',
  'Irregular'
]);

export const UnitSystems = createEnum('Unit System', [
    'English', 'Metric'
])

export const PileCompositionOptions = createEnum('Pile composition', [
    'Conifer', 'ShrubHardwood'
])