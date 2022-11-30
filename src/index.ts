import fs from 'fs'
import { CompilerOptions, ScriptTarget } from 'typescript'
import { ParseResult, ParserOptions } from '@babel/parser'
import { Node, NodePath } from '@babel/traverse'
import * as utils from './utils'
import { getParentNodeByType } from './utils'

export class CallableExtractor {
  protected options: ICallableExtractorOptions
  protected code: string
  protected ast: ParseResult<Node>
  protected nodePaths: NodePath[]

  public constructor (code: string, options?: ICallableExtractorOptions) {
    this.options = {
      ...options,
      parserOptions: { ...parserOptionsDefaults, ...options?.parserOptions },
      compilerOptions: { ...compilerOptionsDefaults, ...options?.compilerOptions },
    }
    this.code = code
    this.ast = utils.parseAst(this.code, this.options.parserOptions)
    this.nodePaths = utils.getNodePaths(this.ast, utils.callableTypes)
  }

  public getCallable (position = 1): ICallable {
    let pos = 1
    for (const nodePath of this.nodePaths) {
      if (utils.isCallableNode(nodePath.node) && position === pos++) {
        const code = utils.extractCallableCode(nodePath, this.options.compilerOptions)
        return this.createCallable(code)
      }
    }

    throw new utils.ErrorCallableNotFound()
  }

  public getCallableByLineNumber (lineNumber: number, position = 1): ICallable {
    let pos = 1
    for (const nodePath of this.nodePaths) {
      const line = nodePath.node.loc?.start.line
      if (line === lineNumber && utils.isCallableNode(nodePath.node) && position === pos++) {
        const code = utils.extractCallableCode(nodePath, this.options.compilerOptions)
        return this.createCallable(code)
      }
    }

    throw new utils.ErrorCallableNotFound()
  }

  public getCallableByLineContent (partialContent: string, position = 1): ICallable {
    const lines = this.code.split('\n')
    const idx = lines.findIndex(l => l.includes(partialContent))
    if (idx === -1) {
      throw new utils.ErrorCallableNotFound()
    }

    return this.getCallableByLineNumber(idx + 1, position)
  }

  public getCallableByName (callableName: string, className: string = ''): ICallable {
    for (const nodePath of this.nodePaths) {
      if (utils.isCallableNode(nodePath.node)) {
        const { id, key } = nodePath.node as { id?: { name: string }, key?: { name: string }}
        const identifier = {
          name: id?.name || key?.name || this.getOwnerName(nodePath, 'VariableDeclarator'),
          owner: className ? this.getOwnerName(nodePath, 'ClassDeclaration') : '',
        }

        if (identifier.name === callableName && identifier.owner === className) {
          const code = utils.extractCallableCode(nodePath, this.options.compilerOptions)
          return this.createCallable(code)
        }
      }
    }

    throw new utils.ErrorCallableNotFound()
  }

  public call (code: string, args: any[] = [], context: Object | null, scope: Object | null, safe: boolean): any {
    const resetScope = this.setScope(scope || {}, safe)
    // eslint-disable-next-line no-new-func
    const func = new Function(`{ return ${code} }`)
    const result = func().call(context, ...args)
    resetScope()
    return result
  }

  protected getOwnerName (nodePath: NodePath, type: Node['type']): string {
    const owner = getParentNodeByType(nodePath, type) as { id?: { name?: string }} | undefined
    return owner?.id?.name || ''
  }

  protected createCallable (code: string, context: Object | null = null, scope: Object = {}, safe = true): ICallable {
    const self = this
    const result: ICallable = {
      code,
      context,
      scope,
      safe,
      call: function (this: ICallable, ...args: any[]): any {
        return self.call(this.code, args, this.context, this.scope, this.safe)
      },
    }
    result.call.bind(result)
    return result
  }

  protected setScope (scope: TObject, safe = true): () => void {
    const globals = global as TObject
    Object.keys(scope).forEach(k => {
      if (!safe && globals[k] !== undefined) {
        throw new Error(`Scope variable is already exists: ${k}`)
      }
      globals[k] = scope[k]
    })
    return () => {
      Object.keys(scope).forEach(k => delete globals[k])
    }
  }

  public static fromFile (filepath: string) {
    const code = fs.readFileSync(filepath).toString()
    return new CallableExtractor(code)
  }
}

const parserOptionsDefaults: ParserOptions = {
  sourceType: 'module',
  errorRecovery: true,
  plugins: ['jsx', 'typescript'],
}

const compilerOptionsDefaults: CompilerOptions = {
  target: ScriptTarget.ES2020,
}

type TObject = { [k: string | number | symbol]: any }

export interface ICallableExtractorOptions {
  parserOptions: ParserOptions
  compilerOptions: CompilerOptions
}

export interface ICallable {
  code: string
  context: TObject | null
  scope: TObject
  safe: boolean
  call(...args: any[]): any
}
