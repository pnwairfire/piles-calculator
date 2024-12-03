import {
  PileType, ShapeTypes, PileCompositionOptions,
  UnitSystems, PileQualityOptions
} from '../src/lib/enums'
import { compute } from '../src/index';

test('returns 1', () => {
  //console.log = jest.fn();
  const r = compute(PileType.Hand, {
     numberOfPiles: 10,
     shape: ShapeTypes.HalfSphere,
     h1: 5,
     percentConsumed: 90,
     pileComposition: PileCompositionOptions.Conifer,
     unitSystem: UnitSystems.English,
  });
  expect(r).toBe(1)
});
