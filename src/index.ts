import fs from 'fs'
import * as utils from './utils'

class CallableExtractor {
  protected options: ICallableExtractorOptions
  protected code: string
  protected ast: utils.ParseResult<utils.Node>
  protected nodePaths: utils.NodePath[]

  /**
   * @param {string} code
   * @param {ICallableExtractorOptions} [options]
   */
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

  /**
   * @param {number} [position]
   * @return {ICallable}
   * @throws {ErrorCallableNotFound}
   */
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

  /**
   * @param {string} lineNumber
   * @param {number} [position]
   * @return {ICallable}
   * @throws {ErrorCallableNotFound}
   */
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

  /**
   * @param {string} partialContent
   * @param {number} [position]
   * @return {ICallable}
   * @throws {ErrorCallableNotFound}
   */
  public getCallableByLineContent (partialContent: string, position = 1): ICallable {
    const lines = this.code.split('\n')
    const idx = lines.findIndex(l => l.includes(partialContent))
    if (idx === -1) {
      throw new utils.ErrorCallableNotFound()
    }

    return this.getCallableByLineNumber(idx + 1, position)
  }

  /**
   * @param {string} callableName
   * @param {string} [className]
   * @return {ICallable}
   * @throws {ErrorCallableNotFound}
   */
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

  /**
   * @param {string} code
   * @param {any[]} args
   * @param {Object|null} context
   * @param {Object} scope
   * @param {boolean} safe
   * @return {any}
   */
  public call (code: string, args: any[] = [], context: Object | null, scope: Object | null, safe: boolean): any {
    const resetScope = this.setScope(scope || {}, safe)
    // eslint-disable-next-line no-new-func
    const func = new Function(`{ return ${code} }`)
    const result = func().call(context, ...args)
    resetScope()
    return result
  }

  /**
   * @protected
   * @param {utils.NodePath} nodePath
   * @param {utils.Node['type']} type
   * @return {string}
   */
  protected getOwnerName (nodePath: utils.NodePath, type: utils.Node['type']): string {
    const owner = utils.getParentNodeByType(nodePath, type) as { id?: { name?: string }} | undefined
    return owner?.id?.name || ''
  }

  /**
   * @protected
   * @param {string} code
   * @param {Object|null} context
   * @param {Object} scope
   * @param {boolean} safe
   * @return {ICallable}
   */
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

  /**
   * @protected
   * @param {TObject} scope
   * @param {boolean} safe
   */
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

  /**
   * @param {string} filepath
   * @return {ICallable}
   */
  public static fromFile (filepath: string) {
    const code = fs.readFileSync(filepath).toString()
    return new CallableExtractor(code)
  }
}

const parserOptionsDefaults: utils.ParserOptions = {
  sourceType: 'module',
  errorRecovery: true,
  plugins: ['jsx', 'typescript'],
}

const compilerOptionsDefaults: utils.CompilerOptions = {
  target: utils.ScriptTarget.ES2020,
}

type TObject = { [k: string | number | symbol]: any }

interface ICallableExtractorOptions {
  parserOptions: utils.ParserOptions
  compilerOptions: utils.CompilerOptions
}

interface ICallable {
  code: string
  context: TObject | null
  scope: TObject
  safe: boolean
  call(...args: any[]): any
}

export { CallableExtractor, ICallableExtractorOptions, ICallable, utils }
