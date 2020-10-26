import  React, {useState}       from 'react';
import { makeStyles }           from '@material-ui/core/styles';

import Table                    from '@material-ui/core/Table';
import TableBody                from '@material-ui/core/TableBody';
import TableCell                from '@material-ui/core/TableCell';
import TableHead                from '@material-ui/core/TableHead';
import TableRow                 from '@material-ui/core/TableRow';
import DeleteIcon               from '@material-ui/icons/Delete';
import FolderIcon               from '@material-ui/icons/Folder';
import { CardActions,
        TablePagination,
        Switch,
        FormControlLabel,
        Tooltip 
    }                           from '@material-ui/core';
import Footer                   from '../components/Footer';
import Dropzone                 from "react-dropzone";
import FileCopyIcon             from '@material-ui/icons/FileCopy';
import DropIcon                 from '../assets/images/dropIcon.png'
import SideDrawer               from '../components/SideDrawer';
import * as DockerUtils         from '../components/DockerUtils'
import Loader                   from '../components/Loader';
import * as Utils               from '../utils/utils'
import RawXml                   from '../components/RawXml';
const { dialog }                = require('electron').remote

var child_process               = require("child_process");
const path                      = require('path');
var fs                          = require('fs');
const commonPath                = require('common-path');


const useStyles = makeStyles((theme) => ({
    root:       {   
        display:                    'flex', 
    },    
    table: {
        minWidth:                   650,
        '& td':{
            paddingTop:             '10px',
            paddingBottom:          '10px'
        }
    },
    container:  {
        display:                    'grid',
        gridGap:                    theme.spacing(2),
    },
    gridItemRight:{
        minHeight:                  '86vh',
        paddingLeft:                '20px!important',

        '& h3':{
            color:                  '#0c3451',
            margin:                 '0 0 20px 0',
        }
    },
    actions: {
        justifyContent:             'flex-end'
    },
    gridItemLeft:{
    },
    dropzone:{
        border:                     '2px dashed #6ab8f0',
        borderRadius:               '35px',
        minHeight:                  '300px',
        display:                    'flex',
        justifyContent:             'center',
        marginBottom:               '20px',
        fontSize:                   '20px',
        alignItems:                 'center',    
        '& p':{
            textAlign:              'center',    
            fontSize:               '25px',
            color:                  '#0c3451'      
        } 
   },
   fileItems:{
        listStyle:                  'none',
        float:                      'left',
        padding:                    '0',
        width:                      '100%',
        '& li':{
            marginBottom:           '10px',
            float:                  'left',
            width:                  '100%',
            borderBottom:           '1px solid #ccc',
            paddingBottom:          '5px',

            '& a':{
                color:              '#0c3451',
                textDecoration:     'none',

                '&:hover':{
                    textDecoration: 'underline'
                }
            }
        }
   },
   icons:{
        fontSize:                   '100px',
        color:                      '#ccc',
        width:                      '80px',
        margin:                     '20px 0 30px 0',
   },
   fileIcon:{
        fontSize:                   '15px',
        float:                      'left',
        margin:                     '3px 6px 0 0',
        color:                      '#488acd'
   },
   dropField:{
        float:                      'left',
        width:                      '100%',
        textAlign:                  'center'
   },
   selectFileBtn:{
        display:                    'block',
        margin:                     '0px auto 30px auto',
        padding:                    '10px',
        minWidth:                   '154px',
        borderRadius:               '4px',
        border:                     '2px solid #6ab8f0',
        color:                      '#6ab8f0',
        background:                 '#fff'
   },
   errMsg:{
        color:                      'red',
        margin:                     '0px 0 10px 0',
        fontSize:                   '15px',
        display:                    'none',
        textAlign:                  'center'
},
    successMsg:{
        color:                      'green',
        margin:                     '0px 0 10px 0',
        fontSize:                   '15px',
        display:                    'none',
        textAlign:                  'center'
    },
    toolbar: {
         display:                   'flex',
         alignItems:                'center',
         justifyContent:            'flex-end',
         padding:                   theme.spacing(0, 1),
         ...theme.mixins.toolbar,
     },
     content: {
        flexGrow:       1,
    },
    contentArea:{
         minHeight:                 '85.7vh',
         padding:                   theme.spacing(3),
    },
     downloadLink:{
        maxWidth:                   '245px',
        display:                    'inline-block',
        textOverflow:               'ellipsis',
        whiteSpace:                 'nowrap',
        overflow:                   'hidden',
        color:                      '#575757;'
     },
     viewBtn:{
        color:                      '#fff',
        border:                     'none',
        padding:                    '7px 10px',
        fontSize:                   '12px',
        fontWeight:                 'normal',
        backgroundColor:            '#0c3451',
        borderRadius:               '3px',
     },
     deleteBtn:{
        background:                 '#1976D2',
        border:                     'none',
        borderRadius:               '3px',
        padding:                    '5px 15px',
        color:                      '#fff',
        fontSize:                   '13px',
        lineHeight:                 '25px',
        position:                   'absolute',
        left:                       '5px',
        marginTop:                  '10px',
        cursor:                     'pointer',
        transition:                 '0.5s',
        '&:hover':{ 
            background:             '#2389ee',
            transition:             '0.5s'
        },
        '&:focus':{ 
            outline:             '0'
        }
     },
     deleteBtnDisabled:{
        border:                    'none',
        borderRadius:              '3px',
        padding:                   '5px 15px',
        color:                     '#fff',
        fontSize:                  '13px',
        lineHeight:                '25px',
        background:                '#ddd',
        position:                  'absolute',
        left:                      '5px',
        marginTop:                 '10px',
    },
     outFolderBtn:{
        background:                 '#3cb371',
        border:                     'none',
        color:                      '#fff',
        borderRadius:               '3px',
        padding:                    '5px 15px',
        fontSize:                   '13px',
        lineHeight:                 '25px',
        float:                      'right',
        cursor:                     'pointer',
        transition:                 '0.5s',
        '&:hover':{ 
            background:             '#3fc87c',
            transition:             '0.5s'
        },
        '&:focus':{ 
            outline:             '0'
        }
     },
     outFolderBtnDissabled:{
        border:                     'none',
        color:                      '#fff',
        borderRadius:               '3px',
        padding:                    '5px 15px',
        fontSize:                   '13px',
        lineHeight:                 '25px',
        background:                 '#ddd'
     },
     btnIcon:{
        float:                      'left',
        fontSize:                   '22px',
        marginRight:                '5px'
     },
     status:{
        '& p':{
            color:                  '#098c44',
            fontWeight:             'bold'
        },
        '& span':{
            color:                  '#ff0000',
            fontWeight:             'bold'
        }
     },
     tableField:{
         position:                  'relative',
        '& h3':{
            background:             '#003962',
            borderRadius:           '3px',
            float:                  'left',
            width:                  '100%',
            borderTop:              '1px solid #ccc',
            borderBottom:           '1px solid #ccc',
            padding:                '5px 5px 5px 10px',
            color:                  '#fff',
            marginBottom:           '5px',
            lineHeight:             '35px',
            fontWeight:             'normal'
        }
    },
    texttBold:{
        fontWeight:                 'bold',
        fontSize:                   '15px'
    },
    settings:{
        borderBottom:               '1px solid #ccc',
        paddingBottom:              '20px',
        float:                      'left',
        width:                      '100%',
        '& h4':{
            fontSize:               '14px',
            color:                  '#003962',
            margin:                 '15px 0'
        }        
    },
    btnHeading:{
        float:                      'left',
        width:                      '100%',
    },
    fileType:{
        float:                      'left',
        width:                      '100%'
    },
    saveFileBtn:{
        '& button':{
            background:              '#084d94',
            border:                  'none',
            color:                   '#fff',
            borderRadius:            '3px',
            padding:                 '5px 15px',
            fontSize:                '13px',
            lineHeight:              '25px',
            float:                   'left',
            cursor:                  'pointer',
            transition:              '0.5s',
            marginRight:             '10px',
            '&:hover':{ 
                background:          '#0f59a5',
                transition:          '0.5s'
            },
            '&:focus':{ 
                outline:             '0'
            }
        },        
        '& input':{
            border:                 '1px solid #ccc',
            padding:                '9px',
            borderRadius:           '3px',
            float:                  'left',
            minWidth:               'calc(100% - 220px)',
            marginRight:            '12px'
        }
    },
    fileOption:{
        float:                      'left',
        '& input':{
            marginRight:            '15px'
        },
        '& span':{            
            fontSize:               '16px',
            marginRight:            '10px'
        }
    },
    alertContainer:{
        width:                      '100%',
        position:                   'fixed',
        height:                     '100%',
        display:                    'flex',
        justifyContent:             'center',
        alignItems:                 'center',
        top:                        '0',
        left:                       '0',
        background:                 'rgba(0,0,0,0.4)',
        zIndex:                     1300
    },  
    alertModel:{
        width:                      '400px',
        background:                 '#fff',
        padding:                    '20px',
        borderRadius:               '5px',
        textAlign:                  'center'
    },
    submitBtn:{
        background:                 '#0c3451',
        color:                      '#fff',
        border:                     'none',
        padding:                    '10px 20px',
        borderRadius:               '3px',
        cursor:                     'pointer'
    },
    toggleContainer:{
        float:                      'right',
        position:                   'relative',
        '& span':{
            fontWeight:             'bold',
            
        },
        '&:hover':{
            '& div':{
                display:            'block'
            }
        }
    },
    fab: {
        margin:                     theme.spacing(2),
    },
    absolute: {
        position:                   'absolute',
        bottom:                     theme.spacing(2),
        right:                      theme.spacing(3),
    },
    infoIcon:{
        margin:                     '13px 5px 0 0px',
        float:                      'left',
        color:                      'gray'
    },
    toggleToolTip:{
        position:                   'relative'
    },
    toggleToolTipTitle:{
        display:                    'none',
        position:                   'absolute',
        background:                 '#0c3451',
        color:                      '#fff',
        margin:                     '10px',
        padding:                    '10px',
        fontSize:                   '12px',
        borderRadius:               '5px',
        left:                       '0px',
        '&::before':{
            content:                '" "',
            height:                 '10px',
            width:                  '10px',
            position:               'absolute',
            background:             '#0c3451',            
            left:                   '14px',
            top:                    '-6px',
            transform:              'rotate(45deg)',
        }
    },
    infobBtn:{}
 }));



function DockerRebuildFiles(){
    
    const classes = useStyles(); 
    const [fileNames, setFileNames]                 = useState<Array<string>>([]);
    const [rebuildFileNames, setRebuildFileNames]   = useState<Array<RebuildResult>>([]);
    const [counter, setCounter]                     = useState(0);
    const [loader, setShowLoader]                   = useState(false);  
    const [id, setId]                               = useState("");  
    const [open, setOpen]                           = useState(false);  
    const [xml, setXml]                             = useState("");  
    const [page, setPage]                           = useState(0); 
    const [rowsPerPage, setRowsPerPage]             = useState(10);  
    const [folderId, setFolderId]                   = useState("");  
    const [targetDir, setTargetDir]                 = useState("");  
    const [userTargetDir, setUserTargetDir]         = useState("");  
    const [masterMetaFile, setMasterMetaFile]       = useState<Array<Metadata>>([]);
    const [showAlertBox, setshowAlertBox]           = useState(false);  
    const [files, setFiles]                         = useState<Array<RebuildResult>>([]);
    const [flat, setFlat]                           = React.useState(true);

    interface RebuildResult {
        id              : string,
        sourceFileUrl   : string;
        url             : string;
        name?           : string;
        msg?            : string;
        isError?        : boolean;
        xmlResult       : string;
        path?           : string;
        cleanFile?      : any;
      }

    
    interface Metadata {
        original_file       : string,
        clean_file?         : string;
        report?             : string;
        status?             : string;
        message?            : string;
        time?               : string;
        userTargetFolder?   : string;
    }

   
    React.useEffect(() => {
        if(folderId!=''){
            var rootFolder = Utils._PROCESSED_FOLDER +folderId
            if (!fs.existsSync(rootFolder)){
                fs.promises.mkdir(rootFolder, { recursive: true });
            }
       
            setTargetDir(rootFolder);
        }
    }, [folderId]);


    React.useEffect(() => {
        if (counter == 0 && loader == true) {
            setShowLoader(false);
            saveTextFile(JSON.stringify(masterMetaFile),  targetDir +"/", 'metadata.json');

            if(userTargetDir !="" && !flat){
                let PATHS: string[];
                PATHS=[]
                rebuildFileNames.map(rebuild=>{
                    if(rebuild.path)
                        PATHS.push(rebuild.path);
                });
                const common = commonPath(PATHS);
                common.parsedPaths.map((cPath:any)=>{
                    saveBase64File( getRebuildFileContent(cPath.original), userTargetDir + "/" + cPath.subdir + "/", cPath.basePart );
            });
        }
        }
      }, [counter]);

    
    
    React.useEffect(() => {
        let rebuildFile: RebuildResult| undefined;
        rebuildFile = rebuildFileNames.find((rebuildFile) => rebuildFile.id ==id);
        if(rebuildFile){
            setXml(rebuildFile.xmlResult);
          }
         }, [id, xml, open]);

    React.useEffect(() => {
     let rebuildResultsPerPage = rebuildFileNames && rebuildFileNames.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
       
        setFiles(rebuildResultsPerPage)
        }, [rowsPerPage, page, rebuildFileNames]);



    //callback for rebuild and analysis
    const downloadResult =(result: any)=>{
    
        setRebuildFileNames(rebuildFileNames =>[...rebuildFileNames,  {
                id:result.id,
                url: result.url,
                name: result.filename,
                sourceFileUrl: result.source,
                isError: result.isError,
                msg: result.msg,
                xmlResult:result.xmlResult,
                path: result.path,
                cleanFile: result.cleanFile
                }]);

        setCounter(state=>state-1);
        let fileHash: string;
        fileHash = Utils.getFileHash(result.original)
          
        if(!result.isError){
            var cleanFilePath = Utils._PROCESSED_FOLDER + result.targetDir + "/" + fileHash +  "/" + Utils._CLEAN_FOLDER;
            saveBase64File(result.cleanFile, cleanFilePath, result.filename );

            var OriginalFilePath = Utils._PROCESSED_FOLDER + result.targetDir + "/" + fileHash +  "/" + Utils._ORIGINAL_FOLDER;
            saveBase64File(result.original, OriginalFilePath, result.filename);

            var reportFilePath = Utils._PROCESSED_FOLDER + result.targetDir + "/" + fileHash +  "/" + Utils._REPORT_FOLDER;
            saveTextFile(result.xmlResult,reportFilePath, Utils.stipFileExt(result.filename)+'.xml');

            var metadataFilePath = Utils._PROCESSED_FOLDER + result.targetDir + "/" + fileHash +  "/";
            let content: Metadata;
            content ={
                original_file       : Utils._ORIGINAL_FOLDER + result.filename,
                clean_file          : Utils._CLEAN_FOLDER + result.filename,
                report              : Utils._REPORT_FOLDER + Utils.stipFileExt(result.filename)+'.xml',
                status              : "Success",
                time                : new Date().toLocaleDateString(),
                userTargetFolder    : userTargetDir,
            }
            saveTextFile(JSON.stringify(content), metadataFilePath, 'metadata.json');
        
            content.original_file = fileHash + "/" + Utils._ORIGINAL_FOLDER + result.filename
            content.clean_file = fileHash + "/" + Utils._CLEAN_FOLDER + result.filename
            content.report = fileHash + "/" + Utils._REPORT_FOLDER + Utils.stipFileExt(result.filename)+'.xml'
            content.userTargetFolder = userTargetDir;
            
            masterMetaFile.push(content);
            if(userTargetDir !=""){
                var filepath = userTargetDir+"/";
                if(flat){
                    saveBase64File(result.cleanFile, filepath, result.filename );
                }
            }
 
        }else{
            var OriginalFilePath = Utils._PROCESSED_FOLDER + result.targetDir + "/" + fileHash +  "/" + 
                Utils._ORIGINAL_FOLDER;
            console.log("Error case:" +OriginalFilePath + ", result.targetDir:" + result.targetDir)
            saveBase64File(result.original, OriginalFilePath, result.filename);
            let content: Metadata;
            content ={
                original_file       : fileHash + "/" + Utils._ORIGINAL_FOLDER + result.filename,
                clean_file          : '',
                report              : '',
                status              : "Failure",
                time                : new Date().toLocaleDateString(),
                userTargetFolder    : userTargetDir,
                message             : result.msg
            }
            masterMetaFile.push(content);
        }
        
    }

    //save base64 file 
    const saveBase64File = async(content: string, filePath: string, filename: string)=>{
        !fs.existsSync(filePath) && fs.mkdirSync(filePath, { recursive: true })
        fs.writeFile(filePath + filename, content, {encoding: 'base64'}, function(err: any) { if (err) {
                console.log('err', err);
            }
        });
    }
   
    //save any text file 
    const saveTextFile = async (xmlContent: string, filePath: string, filename: string) =>{
        !fs.existsSync(filePath) && fs.mkdirSync(filePath, { recursive: true })
        fs.writeFile(filePath+ filename, xmlContent, function(err: any) {if (err) {
                    console.log('err', err);
            }
        });
    }

    const getRebuildFileContent =(filePath: string)=>{
        var rebuild = rebuildFileNames.find(rebuild=>rebuild.path === filePath);
        if(rebuild)
            return rebuild.cleanFile;
        else    
            return null;
    }

     const open_file_exp=(fpath: string)=> {
        var command = '';
        switch (process.platform) {
          case 'darwin':
            command = 'open -R ' + fpath;
            break;
          case 'win32':
            if (process.env.SystemRoot) {
              command = path.join(process.env.SystemRoot, 'explorer.exe');
            } else {
              command = 'explorer.exe';
            }
            fpath = fpath.replace(/\//g, '\\');
            command += ' /select, ' + fpath;
            break;
          default:
            fpath = path.dirname(fpath)
            command = 'xdg-open ' + fpath;
        }
        child_process.exec(command, function(stdout:any) {
        });
    }

    //Multi file drop callback 
    const handleDrop = async (acceptedFiles:any) =>{
        let outputDirId: string;
        if(userTargetDir ==""){
            setshowAlertBox(true);
        }
        else {
            
            setCounter((state: any)=>state + acceptedFiles.length)
            setRebuildFileNames([]);
            setPage(0);
            masterMetaFile.length =0;
            outputDirId = Utils.guid()
            setFolderId(outputDirId);
            setShowLoader(true);
            //console.log(acceptedFiles[0].path)
            acceptedFiles.map(async (file: File) => {
                await DockerUtils.getFile(file).then(async (data: any) => {
                    setFileNames((fileNames: any) =>[...fileNames, file.name]);
                    var url = window.webkitURL.createObjectURL(file);
                    let guid: string;
                    guid =  Utils.guid();                    
                    Utils.sleep(600);
                    await DockerUtils.makeRequest(data, url, guid, outputDirId, downloadResult);
                })
            })
        }
    }  

    //view XML
    const viewXML =(id: string)=>{
        setId(id);
        setOpen(!open);
    }
    const openXml =(open:boolean)=>{
        setOpen(open);
    }

    const handleChangePage = (event: any, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const clearAll =()=>{
        setRebuildFileNames([])
        setMasterMetaFile([]);
    }

    const closeAlertBox = () => {
        setshowAlertBox(false);
    }

    const successCallback =(result: any)=>{
     
        setUserTargetDir(result.filePaths[0])
    }
    const failureCallback =(error: any)=>{
        alert(`An error ocurred selecting the directory :${error.message}`) 
    }

    const selectUserTargetDir =()=>{
        let options = {
            title : "Rebuild Folder", 
            buttonLabel : "Select Rebuild Folder",
            properties:["openDirectory"]
        };
        let promise: any;
        promise = dialog.showOpenDialog(options)
        promise.then(successCallback, failureCallback);
    }

   
    const changeDownloadmode = (event:any) => {
        setFlat((prev) => !prev);
    };   

    return(
        <div>   
            {open && <RawXml content={xml} isOpen={open} handleOpen={openXml}/>   }                
            <div className={classes.root}> 
                <SideDrawer showBack={false}/>
                <main className={classes.content}>
                    <div className={classes.toolbar} />  
                    <div className={classes.contentArea}>             
                    <h3>Rebuild Files With Docker
                    <div className={classes.toggleContainer}>
                    <FormControlLabel className={classes.toggleToolTip}
                        //title={flat ? "Flat" : "Hierarchy"}
                        value={flat ? "Flat" : "Hierarchy"}
                        control={<Switch color="primary" checked={flat} onChange={changeDownloadmode}/>} 
                        label={flat ? "Flat" : "Hierarchy"} />
                        <div className={classes.toggleToolTipTitle}>
                        The hierarchical filesystems to save processed files in a tree structure of directories,
flat filesystem to saves in a ouput/single directory that contains all files with no subdirectories
                        </div>
                    </div>
                    </h3>
                        <Dropzone onDrop={handleDrop} >
                            {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps()} className={classes.dropzone}>
                                <input {...getInputProps()} />
                                    <div className={classes.dropField}>
                                    <p>Drag and drop files</p>
                                    <img src={DropIcon} className={classes.icons}/> 
                                    <button className={classes.selectFileBtn}>Select files</button>
                                </div>
                            </div>
                        )}
                    </Dropzone>
                    <div className={classes.errMsg}> Failed to upload </div>
                    <div className={classes.successMsg}>File uploaded successuly </div>
                    <div>
                    {showAlertBox && 
                                <div className={classes.alertContainer}>
                                    <div className={classes.alertModel}>              
                                        <h3>Please Select Target Directory</h3>               
                                        <button className={classes.submitBtn} onClick={closeAlertBox}>ok</button>
                                    </div>
                                </div>   
                    }                       
                        {loader  && <Loader/> }   
                        
                            <div className={classes.tableField}>
                                <div className={classes.settings}>  
                                    {/* <h2>Settings</h2> */}
                                    <div className={classes.btnHeading}>                                                                           
                                        <h4>Select Directory Path</h4>
                                        <div className={classes.saveFileBtn}>
                                            <input 
                                                readOnly        = {true} 
                                                type            = "text"
                                                placeholder     = "Directory Path"
                                                defaultValue    = {userTargetDir}
                                            />
                                            <button onClick={selectUserTargetDir}>
                                                <FolderIcon className={classes.btnIcon}/> 
                                                Select Target Directory
                                             </button>
                                        </div>
                                    </div>
                                    {/* <div className={classes.fileType}>
                                        <h4>Output Type</h4>
                                        <div className={classes.fileOption}>
                                            <input  type        = "radio" 
                                                    checked     = {outputDirType == Utils.OUTPUT_DIR_FLAT} 
                                                    onChange    = {handleChange}
                                                    value       = {Utils.OUTPUT_DIR_FLAT} 
                                                    name        = "fileoption"/>
                                            <span>Flat</span>
                                        </div>
                                        <div className={classes.fileOption}>
                                            <input  type        = "radio" 
                                                    value       = {Utils.OUTPUT_DIR_HIERARCY}
                                                    onChange    = {handleChange}
                                                    checked     = {outputDirType == Utils.OUTPUT_DIR_HIERARCY} 
                                                    name        = "fileoption"/>
                                            <span>Hierarchy</span>
                                        </div>
                                    </div> */}
                                 </div>
                                 {rebuildFileNames.length>0 && 
                                <div> 
                                <h3>Rebuild Files  With Docker
                                    <button onClick={()=>open_file_exp(targetDir)} className={rebuildFileNames.length>0? classes.outFolderBtn:classes.outFolderBtnDissabled}><FolderIcon className={classes.btnIcon}/> Browse Output Folder</button>
                                </h3>
                                <Table className={classes.table} size="small" aria-label="a dense table">
                                    <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.texttBold}>Status</TableCell>
                                        <TableCell align="left" className={classes.texttBold}>Original</TableCell>
                                        <TableCell align="left" className={classes.texttBold}>Rebuilt</TableCell>
                                        <TableCell align="left" className={classes.texttBold}>XML</TableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {files.map((row) => (
                                        <TableRow key={row.id}>
                                        <TableCell align="left" className={classes.status}>{row.isError == true? <span>Failed</span>:<p>Success</p>}</TableCell>
                                        <TableCell align="left"><a id="download_link" href={row.sourceFileUrl} download={row.name} className={classes.downloadLink} title={row.name}><FileCopyIcon className={classes.fileIcon}/> {row.name}</a></TableCell>
                                        {
                                            !row.isError ?
                                                <TableCell align="left"><a id="download_link" href={row.url} download={row.name} className={classes.downloadLink} title={row.name}><FileCopyIcon className={classes.fileIcon}/>{row.name}</a></TableCell>
                                                : <TableCell align="left">{row.msg}</TableCell>
                                        }
                                         {
                                            !row.isError ?
                                            <TableCell align="left"><button  onClick={() => viewXML(row.id)} className={classes.viewBtn}>{!row.isError?'View Report':''}</button></TableCell>
                                                : <TableCell align="left"></TableCell>
                                        }
                                             
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                                <button onClick={clearAll} className={files.length>0?classes.deleteBtn:classes.deleteBtnDisabled}><DeleteIcon className={classes.btnIcon}/> Clear All</button>
                                </div>
                                }
                            </div>
                            </div>
                       
                        {
                        files.length>0 &&
                         <CardActions className={classes.actions}>
                             <TablePagination
                                  onChangePage        ={handleChangePage }
                                  onChangeRowsPerPage ={handleChangeRowsPerPage}
                                  component           ="div"
                                  count               ={rebuildFileNames.length                   }
                                  page                ={page                           }
                                  rowsPerPage         ={rowsPerPage                    }
                                  rowsPerPageOptions  ={[5, 10, 25, { label: 'All', value: -1 }]     }               
                                  SelectProps         ={{
                                                          inputProps: { 'aria-label': 'rows per page' },
                                                          native: true,
                                                        }}
                              />
                          </CardActions> 
                          }
                    </div>
                    <Footer/>
                </main>
            </div>   
        </div>
       
        
    )
}

export default DockerRebuildFiles;