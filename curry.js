function curry(fn, arity = fn.length) {
  function curried(prevArgs) {
    return function(nextArg) {
      const args = [...prevArgs, nextArg];

      if (args.length >= arity) {
        return fn(...args);
      } else {
        return curried(args);
      }
    }
  }
  return curried([]);
}

function pipe(funcs) {
  function callback(prevInput, curFunc) {
    return curFunc(prevInput);
  }
  return function (param) {
    return funcs.reduce(callback, param);
  }
}

function add(a, b) {
  return a + b
}

function multiply(a, b, c) {
  return a*b*c
}

function addMore(a, b, c, d) {
  return a+b+c+d
}

function divide(a, b) {
  return a/b
}

const curriedAdd = curry(add)
const curriedMultiply = curry(multiply)
const curriedAddMore = curry(addMore)
const curriedDivide = curry(divide)

const compute = pipe(
  [curriedAdd(1), 
  curriedMultiply(2)(3), 
  curriedAddMore(1)(2)(3), 
  curriedDivide(300)]
)


console.log(compute(3));