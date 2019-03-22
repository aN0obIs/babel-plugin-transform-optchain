import { types as t } from '@babel/core';

function constructMemberExpression(chain) {
    if (chain.length === 1) {
        return t.identifier(chain[0]);
    }
    const [first, ...rest] = chain;
    return t.memberExpression(constructMemberExpression(rest), t.identifier(first));
}

function constructLogicalExpression(chain) {
    const right = t.binaryExpression('!=', constructMemberExpression(chain), t.nullLiteral());
    if (chain.length === 1) {
        return right;
    }
    const [_, ...rest] = chain;
    return t.logicalExpression('&&', constructLogicalExpression(rest), right);
}

export default function identifierReversePlugin() {
    return {
        name: 'babel-plugin-transform-optchain',
        visitor: {
            CallExpression(path) {
                if (t.isMemberExpression(path.node.callee) && path.node.arguments.length === 1) {
                    let mExpr = path.node.callee;
                    let chain = [];
                    while (t.isMemberExpression(mExpr)) {
                        chain.push(mExpr.property.name);
                        mExpr = mExpr.object;
                    }
                    if (
                        t.isCallExpression(mExpr) &&
                        t.isIdentifier(mExpr.callee) &&
                        mExpr.callee.name === 'oc' &&
                        mExpr.arguments.length === 1 &&
                        t.isIdentifier(mExpr.arguments[0])
                    ) {
                        chain.push(mExpr.arguments[0].name);
                        path.replaceWith(
                            t.conditionalExpression(
                                constructLogicalExpression(chain),
                                constructMemberExpression(chain),
                                path.node.arguments[0]
                            )
                        );
                    }
                }
            },
            ImportDeclaration(path) {
                if (t.isLiteral(path.node.source) && path.node.source.value === 'ts-optchain') {
                    path.remove();
                }
            }
        }
    };
}
