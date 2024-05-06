/**
 * 多元参数的组合函数
 */

// 偏函数——解决参数中存在固定参数的情况
function wrapFunc(func, fixed) {
  function wrappedFunc(input) {
    const newFunc = func(input, fixed)
    return newFunc;
  }
  return wrappedFunc;
}

const multiply3 = wrapFunc(multiply, 3)
multiply3(2)

// curry化
const curry = (funcs, arity = funcs.length) => {
  const generatedCurried = (prevArgs) => {
    return curried = (nextArg) => {
      const args = [...prevArgs, nextArg];
      if (args.length === arity) {
        return funcs(...args);
      } else {
        return generatedCurried(args)
      }
    }
  }
  return generatedCurried([]);
}




// reduce组合管道
function pipe(...funcs) {
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

const curriedAdd = curry(add);
const curriedMultiply = curry(multiply)
const curriedAddMore = curry(addMore)
const curriedDivide = curry(divide)


const compute = pipe(
  curriedAdd(1), // 只传1个参数，这样就变成1个参数的函数了
  curriedMultiply(2)(3), 
  curriedAddMore(1)(2)(3), 
  curriedDivide(300)
)

console.log(compute(3));