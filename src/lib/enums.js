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

export const PileType = createEnum('Pile Type', [
  'Hand', 'Machine'
])

export const ShapeTypes = createEnum('Shape', [
  'HalfSphere', 'Paraboloid', 'HalfCylinder', 'HalfFrustumOfCone',
  'HalfFrustumOfConeWithRoundedEnds', 'HalfEllipsoidIrregularSolid',
  'Irregular'
])

export const UnitSystems = createEnum('Unit System', [
  'English', 'Metric'
])

export const PileCompositionOptions = createEnum('Pile composition', [
  'Conifer', 'ShrubHardwood'
])

export const PileQualityOptions = createEnum('Pile quality', [
  'Clean', // 0% soil
  'Dirty', // >0 - 10% soil
  'VeryDirty' // >10% soil)
])
