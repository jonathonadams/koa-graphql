/**
 * Because of noImplicitAny: true TS rule, all 3rd party ts modules required decelerations.
 * You can declare 3rd party modules here if you don not want to install the types
 * Although I would recommend installing the type files
 */

declare module 'lodash.keyby';
declare module 'lodash.merge';
declare module 'lodash.omit';
declare module 'graphql-iso-date';
declare module 'glob';
declare module 'koa-morgan';
declare module 'koa-bearer-token';
declare module 'koa-compress';
declare module 'koa-helmet';
declare module 'kcors';

/**
 * Rather than declaring individually, you could declare all like below
 */
// declare module '*';
