/* @flow */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  //模板解析阶段：用正则等方式解析template模板中的指令、class、style等数据，形成AST（抽象语法树）
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    //优化阶段：遍历AST，找出其中的静态节点，并打上标记
    optimize(ast, options)
  }
  //代码生成阶段：将AST转换成渲染函数
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
//baseCompile的核心代码比较简单
//const ast = parse(template.trim(), options)用正则等方式解析template模板中指令、class、style等数据，形成AST
//optimize的主要作用是标记静态节点，这是Vue再编译过程中的一处优化，挡在patch的过程中，DOM-Diff算法会直接跳过静态节点，减少比较过程，优化了patch的性能
//const code = generate(ast, options)将AST转化成render函数字符串的过程，得到的结果是render函数的字符串以及staticRenderFns字符串
