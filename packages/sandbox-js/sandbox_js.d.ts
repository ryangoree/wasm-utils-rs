/* tslint:disable */
/* eslint-disable */
export function initialize(): void;
/**
 * Foo :)
 */
export function foo(order: IOrder): string;
interface IToken {
  symbol: string;
  /**
   * @default 18
   */
  decimals?: number | undefined;
  totalSupply: bigint;
}

interface IOrder {
  account: string;
  amount: bigint;
  token: IToken;
}

