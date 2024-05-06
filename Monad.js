/*
  Monad幺半群——解决嵌套盒子问题
*/
const isEmpty = (x) => x === undefined || x === null;
const Monad = x => ({
  map: f => isEmpty(x) ? Monad(null) : Monad(f(x)),
  flatMap: f => f(x),
  valueOf: () => x
})

/**
 * 它用于计算一个学生的期末成绩，接收两个入参：
 *  学生的文化课分数（generalScore)，以及学生的体育课分数（healthScore）。
 *  将这两个分数分别乘以各自的权重（文化课对应权重High，体育课对应权重Low），最后得到一个总分
 */
// 该函数将对给定 score 作权重为 high 的计算处理
const highWeights = score => score*0.8

// 该函数将对给定 score 作权重为 low 的计算处理
const lowWeights = (score) => score*0.5

const computeFinalScore_HY = (generalScore, healthScore) =>
  Monad(highWeights(generalScore))
    .flatMap(
      generalRes =>
        Monad(lowWeights(healthScore))
          .valueOf() + generalRes)

// const computeFinalScore = (generalScore, healthScore) => 
//   Monad(highWeights(generalScore))
//     .flatMap(
//       generalRes =>
//         Monad(lowWeights(healthScore))
//           .flatMap(
//             healthRes =>
//               healthRes + generalRes
//           ))

console.log(computeFinalScore_HY(200, 100))
