/* eslint-disable @typescript-eslint/no-var-requires */
const register = require("@babel/register").default;

register({ extensions: [".ts", ".tsx", ".js", ".jsx"] });
