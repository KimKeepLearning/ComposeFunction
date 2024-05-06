/**
 * reduce组合函数（Pipe）
 * 一个入参
 */

const arr = [1, 2, 3, 4, 5, 6, 7, 8]  


function pipe(funcs) {
  function callback(prevInput, curFunc) {
    return curFunc(prevInput);
  }
  return function (param) {
    return funcs.reduce(callback, param);
  }
}

function add4(num) {
  return num + 4
}  

function multiply3(num) {
  return num*3
}  

function divide2(num) {
  return num/2
}

const compute = pipe([add4, multiply3, divide2])

console.log(compute(10));

