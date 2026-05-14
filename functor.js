var Container = function (x) {
  this.__value = x;
}

Container.of = function(x) {
  return new Container(x);
}

// 可以在不离开Container的情况操作容器里的值
Container.prototype.map = function (f) {
  return Container.of(f(this.__value));
}

// functor是实现了map函数并遵守一些特定规则的容器类型
// ====================================================
// 1. Maybe functor: 处理null和undefined的情况，避免程序崩溃
var Maybe = function (x) {
  this.__value = x;
}

Maybe.of = function(x) {
  return new Maybe(x);
}

Maybe.prototype.isNothing = function() {
  return this.__value === null || this.__value === undefined;
}

Maybe.prototype.map = function (f) {
  return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.__value));
}

// 点记法调用
Maybe.of({name: "Dinah", age: 14}).map(_.prop("age")).map(add(10));
// curry化调用
var map = curry(function(f, functor) {
  // 把f传递给functor里的map方法，并curry化调用
  return functor.map(f);
});
// functor.map(f) 变成了 map(f)(functor)
var add10ToContainer = map(add(10)); 
add10ToContainer(Container.of(2)); // => Container.of(12)
add10ToContainer(Maybe.of(12)); // => Maybe.of(22)


// ====================================================
// 2. 错误处理(try catch): Either functor
var Left = function(x) {
  this.__value = x;
}

Left.of = function(x) {
  return new Left(x);
}

Left.prototype.map = function (f) {
  return this;
}

var Right = function(x) {
  this.__value = x;
}

Right.of = function(x) {
  return new Right(x);
}

Right.prototype.map = function (f) {
  return Right.of(f(this.__value));
}

// 使用：Either 并不仅仅只对合法性检查这种一般性的错误作用非凡，
// 对一些更严重的、能够中断程序执行的错误比如文件丢失或者 socket 连接断开等，Either 同样效果显著
var getAge = curry(function(now, user) {
  var birthdate = moment(user.birthdate, 'YYYY-MM-DD');
  if(!birthdate.isValid()) return Left.of("Birth date could not be parsed");
  return Right.of(now.diff(birthdate, 'years'));
});
var fortune  = compose(concat("If you survive, you will be "), add(1));
var zoltar = compose(map(console.log), map(fortune), getAge(moment()));

zoltar({birthdate: '2005-12-12'});
// "If you survive, you will be 10"
// Right(undefined)

zoltar({birthdate: 'balloons!'});
// Left("Birth date could not be parsed")

// either 接收三个参数，因为包了 curry，所以可以分批传入
var either = curry(function(f, g, e) {
  // f: 用来处理 Left（错误情况）的函数
  // g: 用来处理 Right（成功情况）的函数
  // e: 跑完前面流水线后最后传过来的数据（一个 Left 或 Right 的实例）
  switch(e.constructor) {
    case Left: return f(e.__value);   // 如果是错误，就执行函数 f，把错误掏出来给它
    case Right: return g(e.__value);  // 如果是成功，就执行函数 g，把数据掏出来给它
  }
});
// id处理Left的情况，fortune处理Right的情况
var zoltar = compose(console.log, either(id, fortune), getAge(moment()));
zoltar({birthdate: '2005-12-12'});
// "If you survive, you will be 10"
// undefined

zoltar({birthdate: 'balloons!'});
// "Birth date could not be parsed"
// undefined

// ====================================================
// 3. IO functor
// 一个带有副作用的操作，如果用函数包裹并返回，就变成了纯函数，受此启发出现了IO functor，代表了一个有副作用的操作，或者说一个需要和外界交互的操作
var IO = function (f) {
  this.__value = f;
}

IO.of = function(x) {
  return new IO(function() { return x; })
}

IO.prototype.map = function (f) {
  return new IO(_.compose(f, this.__value))
}