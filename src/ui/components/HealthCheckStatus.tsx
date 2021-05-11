import  React                   from 'react';
import { makeStyles }           from '@material-ui/core/styles';
import { Link}                  from 'react-router-dom'
import * as LoggerService       from '../services/LoggerService'


const useStyles = makeStyles((theme) => ({
    docerIconGroup:{
        float:                      'left',
        width:                      '100%',
        marginBottom:               '20px',
        '& ul':{
            listStyle:              'none',
            float:                  'right',
            '& li':{
                float:              'left',
                '& p':{
                    float:          'left',
                    padding:        '8px 10px 0 0',
                    margin:         '0',
                    fontSize:      '12px',
                    fontWeight:     'bold',
                }
            }
        },
        '& h3':{
            float:                  'left'
        }
    },
    grenBtn:{
        background:                 'green',
        height:                     '15px',
        width:                      '15px',
        float:                      'left',
        borderRadius:               '100%',
        margin:                     '10px 5px 0 0'
    },
    redBtn:{
        background:                 'red',
        height:                     '15px',
        width:                      '15px',
        float:                      'left',
        borderRadius:               '100%',
        margin:                     '10px 5px 0 0'
    },
    orangeBtn:{
        background:                 'orange',
        height:                     '15px',
        width:                      '15px',
        float:                      'left',
        borderRadius:               '100%',
        margin:                     '10px 5px 0 0'
    },
    configureBtn:{
        background:                 '#0c3451',
        border:                     'none',
        color:                      '#fff',
        borderRadius:               '3px',
        padding:                    '10px',
        float:                      'left',
        fontSize:                   '12px',
    },
    logButton:{
       margin:                      '14px',
       background:                 '#0c3451',
       border:                     'none',
       color:                      '#fff',
       borderRadius:               '3px',
       padding:                    '6px',
       float:                      'left',
       fontSize:                   '12px',
    }
 }));


 type CurrentStatus = {
    status: number;
    rebuildVersion: any;
    handleOpen  :  () => void;    
}



function HealthCheckStatus({rebuildVersion, status, handleOpen}:CurrentStatus){
    const classes = useStyles(); 
    LoggerService.addRawLogLine(2,"-","heatlh status:" + status)
    const getStatusUI =(status: number)=>{

        var uiDOM=null;
        switch(status){
            case 0:{
                uiDOM = <div>
                 <li><span className={classes.grenBtn}> </span> <p>Docker is running</p></li>
                
                </div>    
            }break;
            case 1:{
                uiDOM = 
                <div>
                <li><span className={classes.redBtn}></span><p>Docker not installed</p></li>
                <li><Link to="/configure" className={classes.configureBtn}>Configure</Link></li>
                </div>
                
            }break;
            case 2:{
                uiDOM = 
                    <div>
                    <li><span className={classes.redBtn}></span><p>Docker not started</p></li>
                    <li><Link to="/configure" className={classes.configureBtn}>Configure</Link></li>
                    </div>
            }break;
            case 3:{
                uiDOM =  <div> 
                            <li><span className={classes.orangeBtn}></span><p>GW Rebuild Image not present. Click configure</p></li>
                            <li><Link to="/configure" className={classes.configureBtn}>Configure</Link></li>
                        </div>
            }break;
            case 4:{
                uiDOM =  <div> 
                            <li><span className={classes.orangeBtn}> </span><p>GW Rebuild License key not valid. Click configure</p></li>
                            <li><button className={classes.configureBtn}>Configure</button></li>
                        </div>

            }break;
            case 5:{

            }break;
            case 6:{

            }break;
        }
      return(
        uiDOM
      )
    }

    return(
        <div className={classes.docerIconGroup}>
            <div> 
             <h3>Rebuild With Docker Glasswall CLI Version  {rebuildVersion} </h3> 
             {/* <button onClick={() =>handleOpen()}className={classes.logButton}>Logs</button> */}
            </div>
            <ul>
                {getStatusUI(status)}
            </ul>
        </div> 
       
        
    )
}

export default HealthCheckStatus;