import  React, {useState}       from 'react';
import { makeStyles }           from '@material-ui/core/styles';

import Table                    from '@material-ui/core/Table';
import TableBody                from '@material-ui/core/TableBody';
import TableCell                from '@material-ui/core/TableCell';
import TableHead                from '@material-ui/core/TableHead';
import TableRow                 from '@material-ui/core/TableRow';
import DeleteIcon               from '@material-ui/icons/Delete';
import FolderIcon               from '@material-ui/icons/Folder';
import {Redirect}                 from 'react-router-dom'
import { CardActions,
        TablePagination,
        Switch,
        FormControlLabel
    }                           from '@material-ui/core';
import Footer                   from '../components/Footer';
import Dropzone                 from "react-dropzone";
import FileCopyIcon             from '@material-ui/icons/FileCopy';
import DropIcon                 from '../assets/images/dropIcon.png'
import SideDrawer               from '../components/SideDrawer';
import * as DockerUtils         from '../services/GWDockerService'
import * as SerialDocker        from '../services/GWSerialDockerService'
import Loader                   from '../components/Loader';
import * as Utils               from '../utils/utils'
import * as RebuildUtils        from '../utils/RebuildUtils'
import * as LoggerService       from '../services/LoggerService'
import * as PolicyService       from '../services/PolicyService'
import RawXml                   from '../components/RawXml';
import Logs                     from '../components/Logs';
import HealthCheckStatus        from '../components/HealthCheckStatus'
const { remote }                = require('electron')
import preceiveThreats          from '../services/ThreatIntelligenceService'
import ThreatAnalysisDialog     from '../components/ThreatAnalysisDialog'


var fs                          = require('fs');



const useStyles = makeStyles((theme) => ({
    root:       {   
        display:                    'flex', 
        background:                 '#fff'
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
        width:                      '70%',
        margin:                     '20px auto',
        background:                 '#f3f8fe',
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
   successMsg:{
    color:                      'green',
    margin:                     '0px 0 10px 0',
    fontSize:                   '15px',
    display:                    'none',
    textAlign:                  'center'
},
   selectFileBtn:{
        display:                    'block',
        margin:                     '0px auto 30px auto',
        padding:                    '10px',
        minWidth:                   '154px',
        borderRadius:               '4px',
        color:                      '#fff',
        background:                 '#469ffd',
        border:                     'none'
   },
   errMsg:{
        color:                      'red',
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
         '& h3': {
            marginTop:             '0',
        }
        
    },
    dropzoneArea:{
        pointerEvents:             'none'
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
        backgroundColor:            '#144e78 ',
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
        left:                      '5px',
        marginTop:                 '20px',
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
            outline:                '0'
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
     high:{
        color:                  'red',
        fontWeight:             'bold'
     },
     medium:{
        color:                  'orange',
        fontWeight:             'bold'
     },
     low:{
        color:                  'blue',
        fontWeight:             'bold'
     },
     ok_unknown:{
        color:                  '#098c44',
        fontWeight:             'bold'
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
        '& h4':{
            position:               'relative',
            float:                  'left',  
            '& span':{
                color:                  'red',
                margin:                 '14px 5px 0 0px',
            },
        },
    },
    headingGroup:{
        float:                      'left',
        width:                      '100%'
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
    submitBtn:{
        background:                 '#0c3451',
        color:                      '#fff',
        border:                     'none',
        padding:                    '10px 20px',
        borderRadius:               '3px',
        cursor:                     'pointer'
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
    toggleContainer:{
        float:                      'right',
        position:                   'relative',
        marginTop:                  '5px',
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
        right:                      '30px',
        maxWidth:                   '300px',
        fontWeight:                 'normal',
        width:                      '300',
        '&::before':{
            content:                '" "',
            height:                 '10px',
            width:                  '10px',
            position:               'absolute',
            background:             '#0c3451',            
            right:                   '14px',
            top:                    '-6px',
            transform:              'rotate(45deg)',
        }
    },
    infobBtn:{},
    tableContainer:{
        background:                 '#f9f9f9',
        borderRadius:               '20px',
        padding:                    '20px',
        boxShadow:                  '0px 0px 5px #ccc',
        width:                      '100%',
        marginBottom:               '20px',
        float:                      'left'
    },
    docerIconGroup:{
        '& h3':{

        }
    },

 }));


function DockerRebuildFiles(){
    
    const classes = useStyles(); 
    const [fileNames, setFileNames]                 = useState<Array<string>>([]);
    const [rebuildFileNames, setRebuildFileNames]   = useState<Array<DockerRebuildResult>>([]);
    const [counter, setCounter]                     = useState(0);
    const [loader, setShowLoader]                   = useState(false);  
    const [id, setId]                               = useState("");  
    const [open, setOpen]                           = useState(false);  
    const [xml, setXml]                             = useState("");  
    const [logView, setLogView]                     = useState(false);      
    const [page, setPage]                           = useState(0); 
    const [rowsPerPage, setRowsPerPage]             = useState(10);  
    const [folderId, setFolderId]                   = useState("");  
    const [targetDir, setTargetDir]                 = useState("");  
    const [userTargetDir, setUserTargetDir]         = useState("");  
    const [masterMetaFile, setMasterMetaFile]       = useState<Array<Metadata>>([]);
    const [showAlertBox, setshowAlertBox]           = useState(false);  
    const [files, setFiles]                         = useState<Array<DockerRebuildResult>>([]);
    const [flat, setFlat]                           = React.useState(false);
    const [parallel, setParallel]                   = React.useState(true);
    const [openThreatDialog, setOpenThreatDialog]   = React.useState(false);
    const [threatAnalysis, setThreatAnalysis]       = useState(null);  
    const [healthCheckStatus, setHealthCheckStatus] = React.useState( Number(sessionStorage.getItem("docker_status")) || 0); 
    const [allPath, setAllPath]                     = React.useState<Array<string>>([]);   
    const [rebuildVersion, setRebuildVersion]       = useState(null);    

    interface DockerRebuildResult {
        id              : string,
        sourceFileUrl   : string;
        url             : string;
        name?           : string;
        msg?            : string;
        isError?        : boolean;
        xmlResultDocker : string;
        path?           : string;
        cleanFile?      : any;
        threat?         : boolean;
        threat_level?   : string;
        threat_analysis?: any;
      }
   
    interface Metadata {
        original_file       : string,
        clean_file?         : string;
        report?             : string;
        policy_file?         : string;
        status?             : string;
        message?            : string;
        time?               : number;
        userTargetFolder?   : string;
        rebuildSource       : string;
        isThreat            : boolean;
        threatLevel         : string;
    }
   
    
    React.useEffect(() => {
        console.log("health_chk" + sessionStorage.getItem(Utils.DOCKER_HEALTH_STATUS_KEY))

        setShowLoader(true)
        setUserTargetDir(RebuildUtils.getDockerDefaultOutputFOlder()||"");
        var status = healthCheckStatus;
        if(sessionStorage.getItem(Utils.DOCKER_HEALTH_STATUS_KEY) == null){
            const timer = setTimeout(() => {
                status = DockerUtils.health_chk();
                sessionStorage.setItem(Utils.DOCKER_HEALTH_STATUS_KEY, "" + status )
                setHealthCheckStatus(status)
                setRebuildVersion(SerialDocker.gwCliVersionSerial())
                setShowLoader(false)
               
              }, 100);
            
        } else{
            status = Number(sessionStorage.getItem(Utils.DOCKER_HEALTH_STATUS_KEY));
            setHealthCheckStatus(status)
            setRebuildVersion(SerialDocker.gwCliVersionSerial())
            setShowLoader(false)
        }
    }, []);

    React.useEffect(() => {
        if(folderId!=''){
            var rootFolder = RebuildUtils.getProcessedPath() + Utils.getPathSep() +folderId
            if (!fs.existsSync(rootFolder)){
                fs.promises.mkdir(rootFolder, { recursive: true });
            }
       
            setTargetDir(rootFolder);
        }
    }, [folderId]);

    React.useEffect(() => {
        if (counter == 0 && loader == true) {
            setShowLoader(false);
            sessionStorage.removeItem("docker_session_runnning")
            Utils.saveTextFile(JSON.stringify(masterMetaFile),  targetDir , 'metadata.json');
        }
      }, [counter]);
    
    React.useEffect(() => {
        let rebuildFile: DockerRebuildResult| undefined;
        rebuildFile = rebuildFileNames.find((rebuildFile) => rebuildFile.id ==id);
        if(rebuildFile){            
            setXml(rebuildFile.xmlResultDocker);
            setThreatAnalysis(rebuildFile.threat_analysis)
          }
         }, [id, xml, open]);

    React.useEffect(() => {
        let rebuildFileReverse = rebuildFileNames.slice().reverse()
        let rebuildResultsPerPage = rebuildFileReverse && rebuildFileReverse.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
        setFiles(rebuildResultsPerPage)
        }, [rowsPerPage, page, rebuildFileNames]);


    //callback for rebuild and analysis
    const downloadResult = async (result: any)=>{            
        console.log("***************downloadResult****************")
        let fileHash: string;
        fileHash = Utils.getFileHash(result.original)
        let isThreat = false
        let threatLevel = "Unknown" 
        let threat: any;

        if(!result.isError){

            if(flat){
                Utils.saveBase64File(result.cleanFile, userTargetDir, result.filename );
            }else{
                let filePath: string;
                filePath = Utils.getHieracyPath(result.path, userTargetDir, allPath);
                Utils.saveBase64File(result.cleanFile, filePath , result.filename );
            }
            
            var cleanFilePath = RebuildUtils.getProcessedPath() + Utils.getPathSep()
                                 + result.targetDir + Utils.getPathSep() + fileHash
                                  + Utils.getPathSep() + RebuildUtils._CLEAN_FOLDER;
            Utils.saveBase64File(result.cleanFile, cleanFilePath, result.filename );

            var OriginalFilePath = RebuildUtils.getProcessedPath()  +  Utils.getPathSep()
                                    + result.targetDir +  Utils.getPathSep()
                                     + fileHash +  Utils.getPathSep() + RebuildUtils._ORIGINAL_FOLDER;
            Utils.saveBase64File(result.original, OriginalFilePath, result.filename);  

            var reportFilePath =  RebuildUtils.getProcessedPath() +  Utils.getPathSep()
                                 + result.targetDir +  Utils.getPathSep()
                                  + fileHash +   Utils.getPathSep() + RebuildUtils._REPORT_FOLDER;
            Utils.saveTextFile(result.xmlResult, reportFilePath, Utils.stipFileExt(result.filename)+'.xml');

            var metadataFilePath =  RebuildUtils.getProcessedPath() + Utils.getPathSep() + 
                                    result.targetDir + Utils.getPathSep() + fileHash;

            let content: Metadata;
            content = {
                original_file       : RebuildUtils._ORIGINAL_FOLDER + Utils.getPathSep() + result.filename,
                clean_file          : RebuildUtils._CLEAN_FOLDER + Utils.getPathSep()+ result.filename,
                report              : RebuildUtils._REPORT_FOLDER + Utils.getPathSep() + Utils.stipFileExt(result.filename)+'.xml',
                policy_file         : "config.xml",
                status              : "Success",
                time                : new Date().getTime(),
                userTargetFolder    : userTargetDir,
                rebuildSource       : Utils.REBUILD_TYPE_DOCKER,
                isThreat            : isThreat,
                threatLevel         : threatLevel
            }
            let metaContentCopy = content            
        
            content.original_file = fileHash + Utils.getPathSep() + RebuildUtils._ORIGINAL_FOLDER + Utils.getPathSep() + result.filename
            content.clean_file = fileHash +Utils.getPathSep() + RebuildUtils._CLEAN_FOLDER + Utils.getPathSep() + result.filename
            content.report = fileHash + Utils.getPathSep() + RebuildUtils._REPORT_FOLDER + Utils.getPathSep() + Utils.stipFileExt(result.filename)+'.xml'
            content.userTargetFolder = userTargetDir;
            content.policy_file = fileHash +Utils.getPathSep() + "config.xml";
            
            masterMetaFile.push(content);
            
            // TI Reporting         
            let basePath = RebuildUtils.getProcessedPath() + Utils.getPathSep() + result.targetDir + Utils.getPathSep() + fileHash + Utils.getPathSep()
            let xml = result.xmlResult   
            let reportPath = Utils.stipFileExt(result.filename)+'.xml'
            threat = await preceiveThreats(xml,reportFilePath, reportPath, cleanFilePath, result.filename,basePath)
            console.log('threat level '+threat.threat_level)
            console.log('threats '+JSON.stringify(threat.threats))
            console.log('threats analysis '+JSON.stringify(threat.threat_analysis))
            if(threat){                
                threatLevel = threat.threat_level.toUpperCase() 
                if(threatLevel != "OK" && threatLevel != "UNKNOWN"){
                    isThreat = true
                }
                threat.filename= result.filename;
                threat.fileSize = result.original.length;
            }
            metaContentCopy.isThreat    = isThreat
            metaContentCopy.threatLevel = threatLevel
            // Save policy
            PolicyService.saveAppliedPolicy(metadataFilePath);
            Utils.saveTextFile(JSON.stringify(metaContentCopy), metadataFilePath, 'metadata.json');
        } 
        else{
            let originalRequest= result.request
            let payload = SerialDocker.getAnalysisPayload(originalRequest)
            let xml = SerialDocker.docker_exec_analysis(payload,originalRequest.filename)
            console.log('XML Report for file with reuild error - '+xml)
            var OriginalFilePath =RebuildUtils.getProcessedPath() +  Utils.getPathSep()
                                + result.targetDir + Utils.getPathSep() + fileHash +  Utils.getPathSep() + 
                                RebuildUtils._ORIGINAL_FOLDER;
            console.log("Error case:" +OriginalFilePath + ", result.targetDir:" + result.targetDir)
            Utils.saveBase64File(result.original, OriginalFilePath, result.filename);
            let content: Metadata;
            content = {
                original_file       : fileHash + Utils.getPathSep() + RebuildUtils._ORIGINAL_FOLDER + Utils.getPathSep() + result.filename,
                clean_file          : '',
                report              : '',
                status              : "Failure",
                time                : new Date().getTime(),
                userTargetFolder    : userTargetDir,
                message             : result.msg,
                rebuildSource       : Utils.REBUILD_TYPE_DOCKER,
                isThreat            : isThreat,
                threatLevel         : threatLevel
            }
            masterMetaFile.push(content);
        }        
        setRebuildFileNames(rebuildFileNames =>[...rebuildFileNames,  {
            id:result.id,
            url: result.url,
            name: result.filename,
            sourceFileUrl: result.source,
            isError: result.isError,
            msg: result.msg,
            xmlResultDocker:result.xmlResult,
            path: result.path,
            cleanFile: result.cleanFile,
            threat: isThreat,
            threat_level: threatLevel,
            threat_analysis: threat
            }]);
        setCounter(state=>state-1);

    }

     const renderRedirect = () => {
        if (healthCheckStatus) {
          return <Redirect to='/configure' />
        }
      }

    const processFiles =(files: any)=>{

        let outputDirId: string;
        sessionStorage.setItem("docker_session_runnning", "true");     
        setCounter((state: any)=>state + files.length)
        setRebuildFileNames([]);
        setPage(0);
        masterMetaFile.length =0;
        outputDirId = Utils.guid()
        setFolderId(outputDirId);
        setShowLoader(true); 
        setAllPath([]);     
        files.map((file: any) => {
            allPath.push(file.path);
            if(parallel){
                DockerUtils.getFile(file).then(async (data: any) => {
                    LoggerService.addLogLine(file.name,"Starting rebuild");
                    setFileNames((fileNames: any) =>[...fileNames, file.name]);
                    var url = window.webkitURL.createObjectURL(file);
                    let guid: string;
                    guid =  Utils.guid();                                    
                    DockerUtils.makeRequest(data, url, guid, outputDirId, downloadResult);
                })
            }
            else{
                SerialDocker.getFile(file).then(async (data: any) => {
                    LoggerService.addLogLine(file.name,"Starting rebuild");
                    setFileNames((fileNames: any) =>[...fileNames, file.name]);
                    var url = window.webkitURL.createObjectURL(file);
                    let guid: string;
                    guid =  Utils.guid();                                    
                    SerialDocker.makeRequest(data, url, guid, outputDirId, downloadResult);
                })
            }
        })
        console.log("FILE PATH" + allPath)
    }

    //Multi file drop callback 
    const handleDrop = async (acceptedFiles:any) =>{
        LoggerService.initLogger();
        if(userTargetDir ==""){
            setshowAlertBox(true);
        }
        else 
        {      
             setTimeout(processFiles, 100, acceptedFiles);
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
    const openLogView =()=>{
        setLogView(!logView);
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
        setCounter(0);
        sessionStorage.removeItem("docker_session_runnning")
    }

    const closeAlertBox = () => {
        setshowAlertBox(false);
    }

    const successCallback =(result: any)=>{
        console.log(result.filePaths)
        if(result.filePaths != undefined && result.filePaths.length>0){
            console.log(result.filePaths[0])
            setUserTargetDir(result.filePaths[0])
            localStorage.setItem(RebuildUtils.DOCKER_OUPUT_DIR_KEY, result.filePaths[0]);
        }
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
        promise = remote.dialog.showOpenDialog(options)
        promise.then(successCallback, failureCallback);
    }
   
    
    const changeDownloadmode = (event:any) => {
        setFlat((prev) => !prev);
    };

    const changeProcessingMode = (event:any) => {
        setParallel((prev) => !prev);
    };   

   
    const handleThreadDialogOpen =(open:boolean)=>{
        setOpenThreatDialog(open);
    }

    const viewThreadAnalysis=(id: string)=>{
        setId(id);
        setOpenThreatDialog(!openThreatDialog);
    }


    return(
        <div>   
            {open && <RawXml content={'\'' + xml + '\''} isOpen={open} handleOpen={openXml}/>   }
            {openThreatDialog && <ThreatAnalysisDialog threat ={threatAnalysis} isOpen={openThreatDialog} handleOpen={handleThreadDialogOpen}/>   }
            {logView && <Logs content={ localStorage.getItem("logs") || ""} isOpen={logView} handleOpen={openLogView}/>   }                
            <div className={classes.root}> 
                <SideDrawer showBack={false}/>
                {healthCheckStatus !=0 && healthCheckStatus !=5 && renderRedirect()}
                
                <main className={classes.content}>
                {loader  && <Loader/> }  
                    <div className={classes.toolbar} />  
                    <div className={classes.contentArea}>   
                             
                        <HealthCheckStatus rebuildVersion={rebuildVersion} handleOpen={openLogView} status={healthCheckStatus}/> 
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
                    <div className={classes.tableContainer}>
                   
                        <div>
                            {showAlertBox && 
                                <div className={classes.alertContainer}>
                                    <div className={classes.alertModel}>              
                                        <h3>Please Select Target Directory</h3>               
                                        <button className={classes.submitBtn} onClick={closeAlertBox}>ok</button>
                                    </div>
                                </div>   
                            }                       
                            
                            
                                <div className={classes.tableField}>
                                    <div className={classes.settings}>  
                                        <div className={classes.btnHeading}>                                                                           
                                        <div className={classes.headingGroup}>                                                                         
                                                <h4>Select Directory Path  <span>*</span> </h4>
                                               
                                                <div className={classes.toggleContainer}>
                                                    <FormControlLabel className={classes.toggleToolTip}
                                                        //title={flat ? "Flat" : "Hierarchy"}
                                                        value={flat ? "Flat" : "Hierarchy"}
                                                        control={<Switch color="primary" checked={flat} onChange={changeDownloadmode}/>} 
                                                        label={flat ? " Flat   " : "Hierarchy"} />
                                                        <div className={classes.toggleToolTipTitle}>
                                                        The hierarchical filesystems option to save processed files in a tree structure of directories,
                                flat filesystem option to saves in a single directory that contains all files with no subdirectories
                                                        </div>
                                                    </div>
                                                    <div className={classes.toggleContainer}>
                                                    <FormControlLabel className={classes.toggleToolTip}
                                                        value={parallel ? Utils.TEXT_PARALLEL : Utils.TEXT_SEQUENTIAL}
                                                        control={<Switch color="primary" checked={parallel} 
                                                        onChange={changeProcessingMode}/>} 
                                                        label={parallel ? Utils.TEXT_PARALLEL : Utils.TEXT_SEQUENTIAL} />
                                                      
                                                    </div>
                                            </div>   
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
                                    </div>
                                    {rebuildFileNames.length>0 && 
                                    <div> 
                                    <h3>Rebuild Files  With Docker 
                                        <button onClick={()=>Utils.open_file_exp(targetDir)} className={rebuildFileNames.length>0? classes.outFolderBtn:classes.outFolderBtnDissabled}><FolderIcon className={classes.btnIcon}/> Browse Output Folder</button>
                                    </h3>
                                    <Table className={classes.table} size="small" aria-label="a dense table">
                                        <TableHead>
                                        <TableRow>
                                            <TableCell className={classes.texttBold}>Status</TableCell>
                                            <TableCell align="left" className={classes.texttBold}>Original</TableCell>
                                            <TableCell align="left" className={classes.texttBold}>Rebuilt</TableCell>
                                            <TableCell align="left" className={classes.texttBold}>Threat Level</TableCell>
                                            <TableCell align="left" className={classes.texttBold}>XML</TableCell>
                                            <TableCell align="left" className={classes.texttBold}>Analysis</TableCell>
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
                                            
                                            <TableCell align="left" >{Utils.getFormattedThreatValue(row.threat, row.threat_level, classes)}</TableCell>
                                            {
                                                !row.isError ?
                                                <TableCell align="left"><button  onClick={() => viewXML(row.id)} className={classes.viewBtn}>{!row.isError?'View Report':''}</button></TableCell>
                                                    : <TableCell align="left"></TableCell>
                                            }

                                             {
                                                !row.isError ?
                                                <TableCell align="left"><button  onClick={() => viewThreadAnalysis(row.id)} className={classes.viewBtn}>{!row.isError?'File Analysis':''}</button></TableCell>
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
                    </div>
                   
                </main>
            </div>  
            <Footer/>
        </div>
       
        
    )
}

export default DockerRebuildFiles;
