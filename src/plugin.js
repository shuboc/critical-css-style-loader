export default function({types: t}) {
  let styles = null // E.g.,`abc` in `import abc from './styles.scss'` expression
  let isReactModule = false

  return {
    visitor: {
      Program: {
        enter() {
          styles = null
          isReactModule = false
        },

        exit() {
          styles = null
          isReactModule = false
        }
      },

      // https://github.com/babel/babylon/blob/master/ast/spec.md#importdeclaration
      ImportDeclaration(path) {
        const importPath = path.node.source.value
        if (importPath.match(/\.(css|scss)$/)) {
          // console.log('Styles are being imported from: ', importPath)

          path.node.specifiers.forEach(specifier => {
            const importName = specifier.local.name
            if (t.isImportDefaultSpecifier(specifier)) {
              // console.log('Styles is imported as default:', importName)
              styles = importName

              // TODO: only import when it is a react component being exported

              // Add `import withStyles from '.../withStyles'`
              path.insertBefore(
                t.ImportDeclaration(
                  [t.importDefaultSpecifier(t.identifier('withStyles'))],
                  t.stringLiteral('critical-css-style-loader/lib/withStyles')
                )
              )
            } else {
              throw new Error(
                `Named import styles (${ importName }) is not supported.
                Only styles imported as default are allowed.`
              )
            }
          })
        }

        if (importPath === 'react') {
          isReactModule = true
        }
      },

      ExportDefaultDeclaration(path) {
        const hoc = t.callExpression(t.identifier('withStyles'), [t.identifier(styles)])
        const exportedComponent = path.node.declaration

        if (styles && isReactModule) {
          // TODO: is exportedComponent a React component?

          path.get('declaration').replaceWith(
            t.callExpression(hoc, [exportedComponent])
          )
        }
      }
    }
  }
}
