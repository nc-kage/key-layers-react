"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyStaticProps = (from, to) => {
    const systemProps = [
        'length',
        'name',
        'prototype',
        'WrappedComponent',
        'displayName',
        'childContextTypes',
        'contextTypes',
        'propTypes',
        'caller',
        'arguments',
    ];
    Object.getOwnPropertyNames(from)
        .filter((name) => !systemProps.includes(name))
        .forEach((name) => {
        if (typeof from[name] === 'function') {
            to[name] = from[name].bind(from);
        }
        else {
            to[name] = from[name];
        }
    });
    return to;
};
