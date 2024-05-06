/**
 * 最基本的Box
 */
const Identity = x => ({
  map: f => Identity(f(x)),
  valueOf: () => x,
  inspect: () => `Identity {${x}}`
})
function add4(num) {
  return num + 4
}  
const newBox = Identity(10).map(add4)

// 输出 14
console.log(newBox.valueOf())

/**
 * 判空的box
 */
const isEmpty = (x) => x === undefined || x === null;
const Maybe = x => ({
  map: f => isEmpty(x) ? Maybe(null) : Maybe(f(x)),
  valueOf: () => x
})
function add4(x) {
  return x + 4
}  

function add8(x) {
  x + 8
}

function toString(x) {
  return x.toString()
}  

function addX(x) {
  return x + 'X'
}  

function add10(x) {
  return x + '10'
}

const res = Maybe(10)
              .map(add4)
              .map(add8)
              .map(toString)
              .map(addX)
              .valueOf()

// 输出 Maybe {null}
console.log(res)