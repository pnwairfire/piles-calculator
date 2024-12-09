import { InvalidInputError } from './exceptions.mjs'
import { ShapeTypes } from "./enums.mjs";


export class Shape {

  constructor(shapeType, dimensions) {
    ShapeTypes.validate(shapeType)
    this.shapeType = shapeType
    this.dims = Object.keys(dimensions).reduce((r, d) => {
      r[d] = parseFloat(dimensions[d])
      return r
    }, {})
    this.volume // to trigger computation of volume
  }

  get volume() {
    if (typeof this._volume !== 'undefined')
      return this._volume

    /* Half Sphere */
    if (this.shapeType == ShapeTypes.HalfSphere) {
      /*  volume = (2 * PI * h1^3) / 3  */
      this.validate('h1')
      this._volume = (2 * Math.PI * Math.pow(this.dims.h1, 3)) / 3
    }

    /* Paraboloid */
    else if (this.shapeType == ShapeTypes.Paraboloid) {
      /*  volume = (PI * h1 * w1^2)/8  */
      this.validate('h1', 'w1')
      this._volume = (Math.PI * this.dims.h1 * Math.pow(this.dims.w1, 2)) / 8
    }

    /* Half Cylinder */
    else if (this.shapeType == ShapeTypes.HalfCylinder) {
      /*  volume = (PI * h1 * w1 * l1)/4  */
      this.validate('h1', 'w1', 'l1')
      this._volume = (Math.PI * this.dims.h1 * this.dims.w1 * this.dims.l1) / 4
    }

    /* Half Frustum Of Cone */
    else if (this.shapeType == ShapeTypes.HalfFrustumOfCone) {
      /*  volume = (PI * (l1 * (w1^2 + w2^2 + (w1*w2))))/24  */
      this.validate('w1', 'w2', 'l1')
      this._volume = (Math.PI * (
        this.dims.l1 * (
          Math.pow(this.dims.w1, 2) + Math.pow(this.dims.w2, 2) + (
            this.dims.w1 * this.dims.w2
          )
        )
      )) / 24.0
    }

    /* Half Frustum Of Cone With Rounded Ends */
    else if (this.shapeType == ShapeTypes.HalfFrustumOfConeWithRoundedEnds) {
      /*  volume = (PI * (l1 * (w1^2 + w2^2 + (w1*w2)) + w1^3 + w2^3}]/24  */
      this.validate('w1', 'w2', 'l1')
      this._volume = (Math.PI * (
        this.dims.l1 * (
          Math.pow(this.dims.w1, 2) + Math.pow(this.dims.w2, 2) + (
            this.dims.w1 * this.dims.w2
          )
        ) + Math.pow(this.dims.w1, 3) + Math.pow(this.dims.w2, 3)
      )) / 24.0
    }

    /* Half Ellipsoid Irregular Solid */
    else if (this.shapeType == ShapeTypes.HalfEllipsoidIrregularSolid) {
      /*  volume = (PI * h1 * w1 * l1)/6  */
      this.validate('h1', 'w1', 'l1')
      this._volume = (Math.PI * this.dims.h1 * this.dims.w1 * this.dims.l1) / 6.0
    }

    /* Irregular */
    else if (this.shapeType == ShapeTypes.Irregular) {
      /*  volume = ((l1 + l2)(w1 + w2)(h1 + h2))/8  */
      this.validate('h1', 'h2', 'w1', 'w2', 'l1', 'l2')
      this._volume = (
        (this.dims.l1 + this.dims.l2)
        * (this.dims.w1 + this.dims.w2)
        * (this.dims.h1 + this.dims.h2)
      ) / 8.0
    }
    // this.shapeType will never be anything else, since it was validated

    return this._volume
  }

  validate(...dimensionKeys) {
    const invalid = dimensionKeys.filter(key => {
      return isNaN(this.dims[key]) || this.dims[key] <= 0
    })

    if (invalid.length > 0)
      throw new InvalidInputError(
        `Specify ${invalid.length === 1 ? 'a ' : ''}positive`
        + ` number${invalid.length > 1 ? 's' : ''} for ${invalid.join(', ')}`
      )
  }
}
