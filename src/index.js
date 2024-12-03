import { PileType } from './lib/enums'
import { Shape } from './lib/shape'
import { HandPile, MachinePile } from './lib/pile'

export function compute(pileType, args) {
  /* Main entry point for script and web service */

  const dimensions = ['h1', 'h2','w1', 'w2','l1', 'l2'].reduce((r, d) => {
    if (args[d])
      r[d] = args[d]
    return r
  }, {})

  const shape = new Shape(args.shape, dimensions)
  let pile = (pileType == PileType.Hand) ?
    (new HandPile(args, shape)) : (new MachinePile(args, shape))

  return {
    volume: pile.volume * args.numberOfPiles,
    correctedVolume: pile.correctedVolume * args.numberOfPiles,
    pileMass: pile.pileMass * args.numberOfPiles,
    consumedMass: pile.consumedMass * args.numberOfPiles,
    emissions: Object.keys(pile.emissions).reduce((r, species) => {
      r[species] = pile.emissions[species] * args.numberOfPiles
      return r
    }, {}),
  }
}
