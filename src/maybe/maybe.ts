export type some<T> = {
  _type: 'some',
  value: T
}
export type none = { _type: 'none' }

export type maybe<T> = some<T> | none

const someLift = <T>(x: T): some<T> => ({ _type: 'some', value: x })
const isSome = <T>(x: maybe<T>): x is some<T> => x._type === 'some'
const liftNone = (): none => ({ _type: 'none' })
const isNone = <T>(x: maybe<T>): x is none => x._type === 'none'

export const None = {
  lift: liftNone,
  is: isNone
}
export const Some = {
  lift: someLift,
  is: isSome
}

const maybeMap =
<A, B>(fn: (a: A) => B) =>
(ma: maybe<A>): maybe<B> =>
isSome(ma) ? Some.lift(fn(ma.value)) : None.lift()

const maybeApply = <A, B>(fn: maybe<(a: A) => B>) => (ma: maybe<A>): maybe<B> => 
  isSome(fn)
  ? isSome(ma)
    ? { _type: 'some', value: (fn as unknown as some<(a: A) => B>).value(ma.value)}
    : None.lift()
  : None.lift()

const maybeBind = <A, B> (fn: (a: A) => maybe<B>) => (ma: maybe<A>): maybe<B> => 
  isSome(ma)
  ? fn(ma.value)
  : None.lift()

const maybeExtract = <T>(target: maybe<T>): { value: T | null } =>
isNone(target) ?
({ value: null }) :
({ value: target.value })

const maybeLift = <T>(x: T): maybe<T> =>
x === null || x === undefined ?
None.lift() :
Some.lift(x)

export const Maybe = {
  lift: maybeLift,
  map: maybeMap,
  apply: maybeApply,
  bind: maybeBind,
  extract: maybeExtract
}