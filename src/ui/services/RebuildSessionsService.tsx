import * as Utils           from '../utils/utils'
import * as RebuildUtils    from '../utils/RebuildUtils'

const { readdir, stat }     = require("fs").promises
const { join }              = require("path")
const fs                    = require('fs')


export const getSessionList = async (path: string ) => {
    let dirs:string[] = []
    for (const file of await readdir(path)) {
        if ((await stat(join(path, file))).isDirectory()) {
         dirs = [...dirs, file]
        }
    }
    return dirs
}

export const readSessions = (sessions: string[], resultCallback: Function)=>{
   
    sessions.map(id=>{
        fs.readFile( RebuildUtils.getProcessedPath() + Utils.getPathSep() + id+ Utils.getPathSep() + "metadata.json", 'utf8', function (err:any,data:string) {
            if (err) {
              //return console.log(err);
              resultCallback({"id":id, "metadata":null, "error":true, "msg":err.message })
              return;
            }
            resultCallback({"id":id, "metadata":data, "error":false, "msg":"" })
          });
    })
 
}