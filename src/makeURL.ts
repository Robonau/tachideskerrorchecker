import dotenv from "dotenv"
dotenv.config()

let tmp = process.env.URLbase?.split('//') as [string, string]
export const url = `${tmp[0]}//${process.env.username}:${process.env.password}@${tmp[1]}`