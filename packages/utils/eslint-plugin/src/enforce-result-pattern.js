// ::: tldr Custom ESLint rule to enforce Result pattern usage
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce Result pattern for error handling',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      useResultPattern: 'Use Result<T> pattern instead of throwing errors',
      checkResultObject: 'Result object must be checked with if (!result.ok)',
      noDirectToastError: 'Use showResultToast or withToast instead of direct toast.error calls',
      noTryCatchInAsync: 'Use tryAsync helper instead of try-catch in async functions',
      noThrowInResult: 'Return failure() instead of throwing in Result-returning functions',
    },
    schema: [],
  },

  create(context) {
    // ::: ctx track Result-returning functions
    const resultReturningFunctions = new Set();

    return {
      // ::: api detect functions that return Result type
      FunctionDeclaration(node) {
        if (node.returnType?.typeAnnotation) {
          const typeString = context.getSourceCode().getText(node.returnType.typeAnnotation);
          if (typeString.includes('Result<')) {
            resultReturningFunctions.add(node);
          }
        }
      },

      // ::: api detect arrow functions that return Result
      ArrowFunctionExpression(node) {
        if (node.returnType?.typeAnnotation) {
          const typeString = context.getSourceCode().getText(node.returnType.typeAnnotation);
          if (typeString.includes('Result<')) {
            resultReturningFunctions.add(node);
          }
        }
      },

      // ::: api check for throw statements in Result-returning functions
      ThrowStatement(node) {
        const func = context.getAncestors().reverse().find(
          ancestor => resultReturningFunctions.has(ancestor)
        );
        
        if (func) {
          context.report({
            node,
            messageId: 'noThrowInResult',
          });
        }
      },

      // ::: api check for try-catch in async functions
      TryStatement(node) {
        const func = context.getAncestors().reverse().find(
          ancestor => ancestor.type === 'FunctionDeclaration' || 
                     ancestor.type === 'ArrowFunctionExpression'
        );
        
        if (func && func.async) {
          context.report({
            node,
            messageId: 'noTryCatchInAsync',
          });
        }
      },

      // ::: api check for direct toast.error calls
      CallExpression(node) {
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.name === 'toast' &&
          node.callee.property.name === 'error'
        ) {
          context.report({
            node,
            messageId: 'noDirectToastError',
          });
        }

        // ::: ctx check for unchecked Result objects
        if (node.callee.type === 'Identifier') {
          const parent = node.parent;
          if (
            parent &&
            parent.type === 'VariableDeclarator' &&
            node.callee.name.match(/^(parse|search|fetch|tryAsync)/)
          ) {
            // ::: ctx look for subsequent if (!result.ok) check
            const block = context.getAncestors().reverse().find(
              ancestor => ancestor.type === 'BlockStatement'
            );
            
            if (block) {
              const hasCheck = block.body.some(
                stmt => stmt.type === 'IfStatement' &&
                        stmt.test.type === 'UnaryExpression' &&
                        stmt.test.operator === '!' &&
                        stmt.test.argument.type === 'MemberExpression' &&
                        stmt.test.argument.property.name === 'ok'
              );
              
              if (!hasCheck) {
                context.report({
                  node: parent,
                  messageId: 'checkResultObject',
                });
              }
            }
          }
        }
      },
    };
  },
};