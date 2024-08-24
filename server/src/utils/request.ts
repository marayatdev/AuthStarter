import Express from "express";
import { Send, Query, ParamsDictionary } from "express-serve-static-core";

let app: Express.Application | undefined = undefined;
const PORT = 3001;

export interface TypedRequestBody<T> extends Express.Request {
  body: T;
}

export interface TypedRequestQuery<T extends Query> extends Express.Request {
  query: T;
}

export interface TypedRequestParams<T extends ParamsDictionary> extends Express.Request {
  params: T;
}

/* export interface TypedRequest<T extends Query, U> extends Express.Request {
  body: U;
  query: T;
}
 */
export interface TypedRequest<T extends ParamsDictionary, U, V extends Query> extends Express.Request {
  params: T;
  body: U;
  query: V;
}

export interface TypedResponse<ResBody> extends Express.Response {
  json: Send<ResBody, this>;
}
