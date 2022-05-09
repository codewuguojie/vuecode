/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'

const arrayProto = Array.prototype
//创建一个对象作为拦截器
export const arrayMethods = Object.create(arrayProto)

//改变数组自身的7个方法
const methodsToPatch = [
  'push',//后增
  'pop',//后删
  'shift',//前删
  'unshift',//前增
  'splice',//截取
  'sort',//排序
  'reverse'//倒序
]

/**
 * Intercept mutating methods and emit events
 * 拦截变化的方法并发出事件
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args// 如果是push或unshift方法，那么传入参数就是新增的元素
        break
      case 'splice':
        inserted = args.slice(2)// 如果是splice方法，那么传入参数列表中下标为2的就是新增的元素
        break
    }
    if (inserted) ob.observeArray(inserted)// 调用observe函数将新增的元素转化成响应式
    // notify change
    ob.dep.notify()
    return result
  })
})
