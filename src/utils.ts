import generate from '@babel/generator'
import traverse, { Node, NodePath } from '@babel/traverse'
import { parse, ParserOptions } from '@babel/parser'
import { transpile, CompilerOptions } from 'typescript'

export const callableTypes: NodePath['type'][] = [
  'ClassMethod',
  'FunctionDeclaration',
  'FunctionExpression',
  'ArrowFunctionExpression',
]

export function isCallableNode (node: Node): boolean {
  return callableTypes.includes(node.type)
}

export function parseAst (code: string, opts?: ParserOptions) {
  return parse(code, opts)
}

export function getNodePaths (parent: Node, types?: Node['type'][]) {
  const result: NodePath[] = []
  traverse(parent, {
    enter(nodePath) {
      if (!types || types.includes(nodePath.node.type)) {
        result.push(nodePath)
      }
    },
  })

  return result
}

export function extractCallableCode (nodePath: NodePath, opts?: CompilerOptions): string {
  if (!isCallableNode(nodePath.node)) {
    throw new ErrorCallableNotFound()
  }

  const preparedNode = { ...nodePath.node }
  let isAsync = false
  if (preparedNode.type === 'ClassMethod') {
    isAsync = preparedNode.async
    preparedNode.async = false
    preparedNode.static = false
    preparedNode.accessibility = null
  }
  if (preparedNode.type === 'FunctionDeclaration') {
    isAsync = preparedNode.async
    preparedNode.async = false
    preparedNode.id = null
  }
  let { code } = generate(preparedNode, { comments: false })

  if (nodePath.node.type === 'ClassMethod') {
    code = `function ${code}`
  }
  if (isAsync) {
    code = `async ${code}`
  }

  return transpile(code, opts)
}

export function getParentNodeByType (nodePath: NodePath, type: Node['type']): Node | null {
  if (nodePath.node.type === type) {
    return nodePath.node
  }
  return nodePath.parentPath
    ? getParentNodeByType(nodePath.parentPath, type)
    : null
}

export class ErrorCallableNotFound extends Error {
  public constructor () { super('Callable not found') }
}
