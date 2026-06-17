declare module "jsonwebtoken" {
  export function sign(
    payload: string | Buffer | object,
    secretOrPrivateKey: string,
    options?: any
  ): string;
  
  export function verify(
    token: string,
    secretOrPublicKey: string,
    options?: any
  ): any;
  
  export function decode(
    token: string,
    options?: any
  ): any;
}

declare module "bcryptjs" {
  export function hash(
    s: string,
    salt: number | string
  ): Promise<string>;
  
  export function compare(
    s: string,
    hash: string
  ): Promise<boolean>;
  
  export function genSalt(
    rounds?: number
  ): Promise<string>;
}
