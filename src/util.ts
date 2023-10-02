import { PrismaClient } from "@prisma/client"
import { WebhookClient } from "discord.js"
import dotenv from "dotenv"
dotenv.config()

let tmp = process.env.URLbase?.split('//') as [string, string]
export const url = `${tmp[0]}//${process.env.username}:${process.env.password}@${tmp[1]}`

export async function getBase64(uri: string | undefined | null): Promise<Buffer> {
    const tmp = await fetch(`${process.env.URLbase}${uri}`, {
        headers: process.env.username && process.env.password ?
            {
                Authorization:
                    `Basic ${Buffer.from(process.env.username + ':' + process.env.password).toString('base64')}`
            } :
            undefined
    })
        .then(res => res.arrayBuffer())
        .then(res => Buffer.from(res))
        .catch(e => {
            console.log(e);
            return Buffer.from('')
        })
    return tmp
}

export function shuffle<T>(arra: T[]): T[] {
    let currentIndex = arra.length; let randomIndex
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--;
        [arra[currentIndex], arra[randomIndex]] = [
            arra[randomIndex], arra[currentIndex]]
    }
    return arra
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function isEqual(obj1: { [key: string]: any }, obj2: { [key: string]: any }) {
    var props1 = Object.getOwnPropertyNames(obj1);
    var props2 = Object.getOwnPropertyNames(obj2);
    if (props1.length != props2.length) {
        return false;
    }
    for (var i = 0; i < props1.length; i++) {
        let val1 = obj1[props1[i]];
        let val2 = obj2[props1[i]];
        let isObjects = isObject(val1) && isObject(val2);
        if (isObjects && !isEqual(val1, val2) || !isObjects && val1 !== val2) {
            return false;
        }
    }
    return true;
}

function isObject(object: any) {
    return object != null && typeof object === 'object';
}

let prismaa: PrismaClient | undefined = undefined
if (process.env.DATABASE_URL !== undefined) {
    prismaa = new PrismaClient()
}

let webhookClienta: WebhookClient | undefined = undefined
if (process.env.webhookURL !== undefined) {
    webhookClienta = new WebhookClient({ url: process.env.webhookURL })
}

export const prisma = prismaa
export const webhookClient = webhookClienta
