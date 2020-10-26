var {spawnSync, exec}                   = require('child_process');
import * as Utils                       from '../utils/utils'
const UUID                              = require('pure-uuid');
const fs                                = require('fs-extra')
const path                              = require('path');
import axios                            from "axios";
const shell                             = require('shelljs');
const resolve                           = require('path').resolve

const getPayload = (data: any) => {
    let buffer = Buffer.from(data.content, 'base64');
    let size_of_file = buffer.length / 1000000;
    console.log("File Size (MB) : " + size_of_file);
    var json = {
            fileSize : size_of_file,
            Base64 : data.content
        };
    return json;
}

const getAnalysisPayload = (data: any) => {
    let buffer = Buffer.from(data.content, 'base64');
    let size_of_file = buffer.length / 1000000;
    var json = {
            Base64 : data.content,
            fileSize : size_of_file,
        };
        return json;
}

const getLocalUpload = (data: any) => {
    return {"fileName":data.original_file_name,"fileBody":data.content};
}

const decodeBase64Image=(dataString: string) =>{
    let response: any;
    response = dataString.split(';base64,').pop();
    return response;
}

const writeDecodedBase64File = (baseBase64Response: string, xmlReport:string, request: any, sourceFileUrl: string,
    requestId:string, targetFolder: string, resultCallback: Function) => {
   var decodedBase64 = decodeBase64Image(baseBase64Response);
   var bs = atob(baseBase64Response);
   var buffer = new ArrayBuffer(bs.length);
   var ba = new Uint8Array(buffer);
   for (var i = 0; i < bs.length; i++) {
       ba[i] = bs.charCodeAt(i);
   }
   var file = new Blob([ba], { type: request.type });
   var url = window.webkitURL.createObjectURL(file);
   resultCallback({'source':sourceFileUrl, 'url':url, 'filename':request.filename, isError:false, msg:'',
       cleanFile:decodedBase64, xmlResult: xmlReport, id:requestId, targetDir:targetFolder, original:request.content, path:request.path})
   
}

const writeBinaryFile = (bytes: any,  xmlReport:string, request: any, sourceFileUrl: string, requestId: string,
    targetFolder:string, resultCallback: Function) => {
   var bs = bytes;
   var buffer = new ArrayBuffer(bs.length);
   var ba = new Uint8Array(buffer);
   for (var i = 0; i < bs.length; i++) {
       ba[i] = bs.charCodeAt(i);
   }
   var file = new Blob([ba], { type: request.type });
   var url = window.webkitURL.createObjectURL(file);
   resultCallback({'source':sourceFileUrl,  'url':url, 'filename':request.filename, isError: false, msg:'',
     cleanFile:buffer, xmlResult: xmlReport, id:requestId, targetDir:targetFolder, original:request.content,path:request.paths })
  
}

const getBase64 = (file: File) => {
   let res = new Promise(resolve => {
       var reader = new FileReader();
       reader.onload = function (event: any) {
           resolve(event.target.result);
       };
       reader.readAsDataURL(file);
   });
   return res;
}

export const makeRequest = async (request: any, sourceFileUrl: string, requestId: string, folderId: string,
      resultCallback: Function) => {
    let payload: string | any;
    let url : string;
    url = Utils.REBUILD_ENGINE_URL;

    payload = getPayload(request)
    var fileSize = payload.fileSize;

    
    if(fileSize < 6){
        const rebuiltBase64 = docker_exec_rebuild(payload,request.filename);
        if(rebuiltBase64 == null){
            resultCallback({'source':sourceFileUrl, 'url':'TBD', 'filename':request.filename, isError:true,
                msg:'File could not be rebuilt', id:requestId, targetDir:folderId, original:request.content});
                return;
        }
        
        try{
            await getAnalysisResult(false, rebuiltBase64, request, sourceFileUrl, requestId, folderId, resultCallback);
        }
        catch(err:any){
            console.log("3:" + JSON.stringify(err));
            if(err.message.indexOf('422') > -1){
                resultCallback({'source':sourceFileUrl, 'url':'TBD', 'filename':request.filename, isError:true,
             msg:'File of this type cannot be processed - '+err.message, id:requestId, targetDir:folderId, original:request.content})
            }
            else{
                resultCallback({'source':sourceFileUrl, 'url':'TBD', 'filename':request.filename, isError:true,
                  msg:err.message, id:requestId, targetDir:folderId, original:request.content})
            }
        }        
    }
    else{
        resultCallback({'source':sourceFileUrl, 'url':'TBD', 'filename':request.filename, isError:true,
             msg:'File too big. 4 bytes to 6 MB file size bracket', id:requestId, targetDir:folderId, original:request.content})
    }
}

export const getAnalysisResult= async (isBinaryFile: boolean, reBuildResponse: any, request: any, sourceFile: string,
     requestId: string, targetFolder: string, resultCallback: Function)=>{

    let payload: string | any;
    let url : string;
    url = Utils.REBUILD_ANALYSIS_URL;

    payload = getAnalysisPayload(request)
    var fileSize = payload.fileSize;
    // Files smaller than 6MB - Normal
    payload = JSON.stringify(payload)
    Utils.sleep(500);

    if(fileSize < 6){
        return await axios.post(url, payload, {
                headers: {
                    "x-api-key": Utils.REBUILD_API_KEY,
                    "Content-Type": "application/json"
                }
            })
        .then((response: { status: string | number; data: string; }) => {
            console.log("response.status" + response.status)
            if(response.status === 200){
               if(isBinaryFile){
                    writeBinaryFile(reBuildResponse, response.data, request, sourceFile, requestId, targetFolder, resultCallback)
               }else{
                    writeDecodedBase64File(reBuildResponse, response.data, request, sourceFile, requestId,
                         targetFolder, resultCallback)
               }
            }
        })
        .catch((err: { message: string; }) => {
            console.log("11" + err.message);
            resultCallback({'source':sourceFile, 'url':'TBD', 'filename':request.filename, isError:true,
                 msg:err.message, id:requestId, targetDir:targetFolder, original:request.content})
        })
    }
    else{
        resultCallback({'source':sourceFile, 'url':'TBD', 'filename':request.filename, isError:true,
             msg:'File too big. 4 bytes to 30 MB file size bracket', id:requestId, targetDir:targetFolder, original:request.content})
    }
}


export const getFile = (file: any) => {

    return getBase64(file).then((result: any) => {
        var encodedImage = result;
        var data = {type:file.type, filename:file.name, originalFileSize:file.size, content:null, path:file.path};
        if (file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png")
            data.content = encodedImage.replace(/^data:image\/\w+;base64,/, "");
        else
            data.content = encodedImage.replace(/^data:.*?;base64,/, "")
        return data;
    });

}

export const docker_exec_rebuild = (payload: any,fileName:string) => {
    const id = new UUID(4).format();
    const directory = path.join('.', 'temp', id);
    const inputDir = path.join(directory,'input');
    const outputDir = path.join(directory,'output');
    shell.mkdir('-p', directory);
    //fs.mkdirSync(directory);
    fs.mkdirSync(inputDir);
    fs.mkdirSync(outputDir);
    console.log('payload '+JSON.stringify(payload));    
    console.log('fileName '+fileName);
    console.log('inputDir '+inputDir);
    console.log('outputDir '+outputDir);
    var base64Data = payload.Base64.replace(/^data:image\/png;base64,/, "");
    fs.writeFileSync(path.join(inputDir,fileName),base64Data,{encoding:"base64"});
    console.log("Created rebuild dirs in "+directory+", inputDir "+inputDir+", outputDir"+outputDir);
    var options={"timeout":5000};
    var totalOutput : any;
    // Check if image there
    var checkResponse = spawnSync('docker', ['images'],options);    
    if(checkResponse.hasOwnProperty("output")){        
        for(var i=0;i<checkResponse["output"].length;i++){
            var output = checkResponse["output"][i];            
            if(output != null && output != ""){
                totalOutput = totalOutput+output;
            }            
        }
    }
    console.log("Image check output = "+totalOutput);    
    // Pull if not
    if (totalOutput.indexOf("72216de678ab") == -1){
        totalOutput = "";
        var pullResponse = spawnSync('docker', [ 'pull','glasswallsolutions/evaluationsdk:1']);
        if(pullResponse.hasOwnProperty("output")){            
            for(var i=0;i<pullResponse["output"].length;i++){
                var output = pullResponse["output"][i];        
                if(output != null && output != ""){
                    totalOutput = totalOutput+output;
                }            
            }
        console.log("PullResponse output = "+totalOutput);        
        }
    }
    totalOutput = "";
    // Run container    
    var spawned = spawnSync('docker', [ 'run',
                                        '--rm',
                                        '-v', resolve(inputDir)+':/input',
                                        '-v', resolve(outputDir)+':/output',
                                        'glasswallsolutions/evaluationsdk:1']);
    console.log("Got response "+String(spawned))             
     if(spawned.hasOwnProperty("output")){
        console.log("Spawned length "+spawned["output"].length);
        for(var i=0;i<spawned["output"].length;i++){
            var output = spawned["output"][i];
            console.log("Spawned output"+output);
            if(output != null && output != ""){
                totalOutput = totalOutput+output;
            }            
        }
        console.log("Rebuild output = "+totalOutput);
        if (fs.existsSync(path.join(outputDir,'Managed'))) {
            const outFile = path.join(outputDir,'Managed',fileName);
            if(fs.existsSync(outFile)){
                const contents = fs.readFileSync(outFile, {encoding: 'base64'});     
                return contents;
            }
            else{
                console.log('File failed rebuild, Managed dir was there but not the rebuilt file');
                return null;
            }
        }
        else{
            console.log('File failed rebuild');
            return null;
        }
     }
     else{
        console.log("Does not have output property");
     }
     // TODO : Cleanup temp
     return null;
}

const new_guid = () => {
        return new UUID(4).format()
}