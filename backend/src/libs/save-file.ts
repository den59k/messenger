import fs from 'fs'
import { pipeline } from "stream";
import { MultipartFile } from "fastify-multipart";
import path from 'path';
import { nanoid } from 'nanoid';
import sharp, { FitEnum } from 'sharp'

const folders = [
  'avatars'
]
type folder = '.' | 'avatars'

export const uploadPath = path.join(process.cwd(), '/public')
if(!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath)
for(let path of folders)
  if(!fs.existsSync(uploadPath+"/"+path)) fs.mkdirSync(uploadPath+"/"+path)

export const saveFile = (file: MultipartFile, folder: folder, postfix="") => new Promise((res, rej) => {
  const _folder = folder === '.'? '': '/'+folder
  const name = nanoid(30)+postfix+path.extname(file.filename)
  pipeline(file.file, fs.createWriteStream(uploadPath+_folder+"/"+name), (err) => {
    if(err) return rej (err)
    res(_folder+"/"+name)
  })
})  

declare interface options {
  folder?: folder,
  size?: number,
  postfix?: string,
  fit?: keyof FitEnum
}

export const saveFileAndCrop = (file: MultipartFile, options: options) => new Promise((res, rej) => {
  
  const folder = options.folder || "."
  const size = options.size || 200
  const postfix = options.postfix || ""
  const fit = options.fit || "cover"

  const _folder = folder === '.'? '': '/'+folder
  const name = nanoid(30)+postfix+".jpg"

  const stream = sharp().resize({ fit, width: size, height: size, withoutEnlargement: true }).rotate().jpeg({ quality: 90 })

  pipeline(file.file, stream, fs.createWriteStream(uploadPath+_folder+"/"+name), (err) => {
    if(err) return rej (err)
    res(_folder+"/"+name)
  })
})
