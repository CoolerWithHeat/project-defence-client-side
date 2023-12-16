import './assets/css/sidebar.scss'
import './assets/css/LanguageBar.scss'
import Profile from "./User";
import React from "react";
import Header from './globalCollections';
import Switch, { switchClasses, }  from '@mui/joy/Switch';
import ShowcasePage from 'mainDisplay';
import Icons from 'icons';  
import getHost from 'host';
import defautCL_image from './assets/img/collectionDefault.jpg'
import { SelectedButton } from 'redux/reducers';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DownloadCSV } from 'csv';
import { LanguagePack } from 'redux/reducers';
import {
    Card,
    CardBody,
    CardFooter,
    CardTitle,
    Row,
    Col,
} from "reactstrap";


var host = getHost();

function filterArray(mainArray, RemovedArray){
    const filteredItems = mainArray.filter(item => !RemovedArray.includes(item));
    return filteredItems
}

export function LanugageToggle(){
    const wasFrench = localStorage.getItem('languageFR')
    const [active, update_active] = React.useState(false)
    const language_update_path = LanguagePack.actions.Update_Language
    const language_indeces = {
        false: 1,
        true:  0,
    }

    React.useEffect(Main=>{
        const result = JSON.parse(wasFrench)
        if (result)
            UpdateLanguage({target: {checked: true}})
    }, [])
    const dispatch = useDispatch()

    const UpdateLanguage = (tagpoint)=>{
        const value = tagpoint.target.checked
        console.log(value)
        dispatch(language_update_path(language_indeces[!active]))
        update_active(Prev=>!Prev)
        localStorage.setItem('languageFR', value)
    }
    return (
        <div id='LanguageBar'>
            <center>
                <div class="switch">
                    <input onClick={UpdateLanguage} checked={active} id="language-toggle" className="check-toggle check-toggle-round-flat" type="checkbox"/>
                    <label for="language-toggle"></label>
                    <span className="off">fr</span>
                    <span className="on">en</span>
                </div>
            </center>
        </div>
    )
}

function generateRandomId() {
    const min = 10000000;
    const max = 99999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
    
export const All_Collections = ({nightMode, headerData, callback})=>{
    return (
        <>
            <Header callback={callback} nightMode={nightMode} header={headerData}/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <ShowcasePage nightMode={nightMode}/>
        </>
    )   
}

const LockedField = ({fieldName, FieldType, textColor})=>{
    return (
        <div>
            <div id='AdditionalFieldClosure'>
            <input disabled={true} value={fieldName} placeholder='Name' id='FieldLabel' />
            <p style={{ color: textColor }} id='FieldType'>
                <div>
                    {FieldType} FieldType
                </div>
            </p>
            </div>
            <hr />
        </div>
    )
}


export function PersonalPage({nightMode}){
    const selectedLanguage = useSelector(Main=>Main.Languages.SelectedLanguage)
    const translations = useSelector(Main=>Main.Languages.translations[selectedLanguage])
    const [deleteMode, Update_deleteMode] = React.useState(false);
    const [additionMode, Update_additionMode] = React.useState(false);
    const [confirmed, update_confirmed] = React.useState(false);
    const [collections, update_collections] = React.useState([])
    const [chosen_for_delete, update_chosen] = React.useState([])
    const [first_animation, update_first_animation] = React.useState(true)
    const [step, update_step] = React.useState(1)
    const collectionsWindow = React.useRef();
    const token = localStorage.getItem('users-token')
    const textColor = nightMode ? 'white' : 'black'
    const If_border = nightMode ? '1px solid #343a40' : null
    const title = React.useRef(null)
    const topic = React.useRef(null)
    const description = React.useRef(null)
    const collection_image = React.useRef(null)
    const navigate = useNavigate();
    async function Create_Collection(data){
    
        const request = await fetch(host+`/CreateCl/`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
            },
            body: data
        },
        )
        const result = await request.json()
        if (request.status == 200){
            localStorage.setItem('savedCollectionID', result.collection.id)
            update_step(2)
        }else{
            window.location.pathname = '../../register/';
        }
    }

    function add_for_deletion(id){
        function updateList(idList, individualID) {
            if (idList.includes(individualID)) {
              idList.splice(idList.indexOf(individualID), 1);
            } else {
              idList.push(individualID);
            }
            return idList;
        }      
        update_chosen([...updateList(chosen_for_delete, id)])
        update_first_animation(false)
    }

    const submit = ()=>{
        const name = title.current
        const cat = topic.current
        const details = description.current
        const picture = collection_image.current
        if (name && cat){
            const data = new FormData();
            data.append('name', name.value);
            data.append('topic', cat.value);
            data.append('description', !details.value ? null : details.value);
            data.append('image', !picture.files[0] ? null : picture.files[0]);
            if (name.value && cat.value)
                Create_Collection(data)
                update_confirmed(false)
        }   
    }
        
    const ItemCard = ({name, category, nightMode, editMode, addMode, id, image})=> {

        const AdditionForm = ()=>{

            const [dropedDown, update_dropedDown] = React.useState(false)
            const [lockDropDown, update_lockDropDown] = React.useState(false)
            const [fields, update_fields] = React.useState()
            const [RecordedCustom_fields, update_customFields] = React.useState([])
            const [savedFields, update_savedFields]  = React.useState([])
            const windowRef = React.useRef()

            const AddField = (dataType)=>{
                const fieldIndex = Number(localStorage.getItem('FieldIndex')) + 1;
                update_fields(<Field assignedID={fieldIndex} textColor={textColor} fieldType={dataType}/>)
                update_dropedDown(!dropedDown)
                localStorage.setItem('FieldIndex', fieldIndex)
                if(windowRef.current)
                    windowRef.current.scrollIntoView({ behavior: 'smooth', block:'end' , inline: 'nearest'});
            }

            const Proceed = ()=>{
                if (!additionMode)
                    window.scrollTo({
                        top: window.document.body.offsetHeight,
                        behavior: 'smooth',
                    });
                    update_confirmed(!confirmed)
                    submit()
            }
            
            function Field({assignedID, fieldType, textColor }) {

                const [FieldName, update_FieldName] = React.useState('')
                const RecordField = (tagpoint)=>{
                    const value = tagpoint.target.value;
                    if (value)
                        update_FieldName(value)
                }

                const SaveField = ()=>{
                    if (FieldName == ''){

                    }else{
                        update_customFields([...RecordedCustom_fields, [fieldType, FieldName]])
                        update_lockDropDown(false)
                        update_fields(null)
                        update_savedFields([...savedFields, <LockedField fieldName={FieldName} FieldType={fieldType} textColor={textColor}/>])
                    }
                }


                React.useEffect(Main=>{
                    update_lockDropDown(true)
                    
                }, [])

                return (
                <div>
                    <div id='AdditionalFieldClosure'>
                    <input onChange={RecordField} placeholder='Name' id='FieldLabel' />
                    <p style={{ color: textColor }} id='FieldType'>
                        <div>
                            {fieldType} {translations['field']}
                        </div>
                        <div onClick={SaveField} style={{float:'right'}}>
                            <Icons size={30} name={'tick'} color={'#6f42c1'}/>
                        </div>
                    </p>
                    </div>
                    <hr />
                </div>
                );
              }

            function Save_All_CustomFields(){
                
                async function RequestCustomFields(data, CL_ID){
                    const request = await fetch(host+`/SaveCustom_Field/${CL_ID}/`,
                        {
                            method: 'POST',
                            headers: {
                                'Authorization': `Token ${token}`,
                            },
                            body: JSON.stringify(data)
                        },
                    )
                    const result = await request.json()
                    if (request.status == 200){
                        update_collections([...collections, result.collection])
                        update_step(1)
                        localStorage.removeItem('step1')
                        localStorage.removeItem('savedCollectionID')
                        Update_additionMode(false)
                    }
                }   
                const createdCollection = localStorage.getItem('savedCollectionID')
                RequestCustomFields(RecordedCustom_fields, createdCollection)
            }

            const AdditionalFields = ()=>{
                return (
                    <div id='CustomFieldsWindow'>
                        <h5 style={{color:textColor}}>{translations['anycustomfield?']}</h5>
                        <div className="btn-group dropright">
                            
                        { lockDropDown ? null : <button onClick={()=>update_dropedDown(!dropedDown)}  type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {translations['addfield']}
                        </button>
                        }
                            <div className={`dropdown-menu ${dropedDown ? 'show' : null}`}>
                            
                                <p onClick={()=>AddField('date')} style={{padding:'7px'}}>date</p> 
                                <p onClick={()=>AddField('string')} style={{padding:'7px'}}>string</p>
                                <p onClick={()=>AddField('integer')} style={{padding:'7px'}}>integer</p>
                                <p onClick={()=>AddField('checkbox')} style={{padding:'7px'}}>checkbox</p>
                                <p onClick={()=>AddField('multi text')} style={{padding:'7px'}}>multi text</p>
                                
                            </div>
                        </div>
                        <div style={{minHeight:fields ? '200px' : null}} ref={windowRef}>
                            {savedFields}
                            {fields}

                        </div>
                        <hr/>
                        <button onClick={Save_All_CustomFields} id='CreateButton' className='btn btn-warning'>{translations['save']}</button>
                    </div>
                )
            }

            return (
                <div>
                    {step == 2 ? <AdditionalFields/> : 
                    <>
                        <div id='CreationForm'>
                            <input ref={title} className='form-control' placeholder={translations['title']}/>
                            <select ref={topic} className="form-select form-select-sm" aria-label=".form-select-lg example" defaultValue='0'>
                                <option id='CategoryOption' value="0">{translations['category']}</option>
                                <option id='CategoryOption' value="1">{translations['books']}</option>
                                <option id='CategoryOption' value="2">{translations['post-stamps']}</option>
                                <option id='CategoryOption' value="3">{translations['whiskeys']}</option>
                                <option id='CategoryOption' value="4">{translations['other']}</option>
                            </select>
                            <div className="form-group">
                                <textarea ref={description} className="form-control" id="exampleFormControlTextarea1" rows="3" placeholder={`${translations['description']} (mark-down)`}></textarea>
                            </div>
                            <input ref={collection_image} className="form-control form-control-sm" id="formFileSm" type="file"/>
                        </div>
                        <div onClick={Proceed} className='btn btn-primary'>{translations['save']}</div>
                    </>
                }
                </div>
                )
    }

        const redirectToPage = (id)=>{
            navigate(`\../Collection/${id}`, {replace:false})
        }
        
        return( 
            <div onClick={()=>addMode || editMode ? null : redirectToPage(id)} className="card" style={{width:'18rem', padding:'15px', backgroundColor: nightMode ? '#343a40' : 'transparent', border:If_border, borderRadius:'7px', minHeight:'250px', maxHeight:'300px', overflowY: additionMode ? 'scroll' : null}}> 
                {addMode ? <AdditionForm/> : 
                    <>
                        {editMode ? <CheckBox id={id} callback={add_for_deletion}/> : null}
                        <img className="card-img-top" src={image} alt="Card image cap"/>
                        <div className="card-body">
                            <p style={{color:textColor}} className="card-text">{name}</p>
                            <span style={{float:'right', textTransform: 'lowercase'}} className="badge badge-warning">{category}</span>
                        </div>
                    </>
                }
            </div>
        )
    }

    function CheckBox({id, callback}){
        const boxRef = React.useRef(null)
        function Update(datapoint){
            callback(id)
        }
        React.useEffect(Main=>{
            const need_animation = first_animation;
            setTimeout(() => {
                if (boxRef.current && need_animation)
                boxRef.current.checked = true
            }, 111);
            setTimeout(() => {
                if (boxRef.current && need_animation)
                boxRef.current.checked = false
            }, 777);

        }, [])
        
        return (
            <div id='CheckBoxField'>
                <label className="checkbox bounce">
                    <input ref={boxRef} onChange={Update} checked={chosen_for_delete.includes(id)} type="checkbox"/>
                        <svg viewBox="0 0 21 21">
                            <polyline points="5 10.75 8.5 14.25 16 6"/>
                        </svg>
                </label>
            </div>
        )
    }

    async function DeleteCollections(){
        const request = await fetch(host+'/delete_collections/',
        {
            method:'POST',
            headers:    {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            body: JSON.stringify({requested_ids: chosen_for_delete})
            }
        )
        const result = await request.json()
        if (request.status == 200){
            const updated_collections = collections.filter(each=>{
                return !result.deleted_IDs.includes(each.id)
            })
            update_collections([...updated_collections])
        }else{
            navigate('../register', {replace:true})
        }
    }
    
    async function getCollections(){
        const request = await fetch(host+'/users-collections/',
        {
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
            },
        }
        )
        const result = await request.json()
        if (request.status == 200){
            update_collections(result.collections)
        }
    }

    async function deleteSelected(){
        Update_additionMode(false)
        if (deleteMode){
            setTimeout(() => {
                return Update_deleteMode(!deleteMode)  
            }, 999);
            DeleteCollections()
        }
        return Update_deleteMode(!deleteMode) 
    }

    function AdditionSelected(){
        Update_deleteMode(false)
        Update_additionMode(!additionMode)
    }
    
    const processedCollections = collections.map(each=><ItemCard image={!each.image ? defautCL_image : each.image} key={each.id} name={each.name} category={each.topic} nightMode={nightMode} editMode={deleteMode} id={each.id}/>)
    React.useEffect(()=>{getCollections()}, [])

    return (

        <div className="content">   
            <Row >
                <Header nightMode={nightMode} header={translations['personal']}/>
                <hr/>
                <hr/>
                <hr/>
                <hr/>
                <hr/>
                <Collections languagePack={translations} nightMode={nightMode}/>
                <Items languagePack={translations} nightMode={nightMode}/>
                <Comments languagePack={translations} nightMode={nightMode}/>

                <div>
                    <button style={{maxWidth:'120px', maxHeight:'55px', color:textColor}} onClick={deleteSelected} className={`btn btn-${deleteMode ? 'danger' : 'link'}`}>
                        {!deleteMode ? <Icons name={'trash'} size={'20'} color={'red'}/> : null} {deleteMode ? translations['i confirm & delete']: translations['delete']}
                    </button>

                    <button onClick={AdditionSelected} style={{maxWidth:'120px', maxHeight:'55px', color:textColor}} className={`btn btn-${additionMode ? 'danger' : 'link'}`}>
                        <Icons name={'add'} size={'20'} color={additionMode ? 'white' : nightMode ? 'white' : '#D19D00'}/> {additionMode ? translations['cancel']: translations['add']}
                    </button>
                    <button onClick={()=>DownloadCSV(collections)} className='btn btn-primary'>{translations['download CSV']}</button>
                </div>

            </Row>

            <Row>
                
            <Col md="12">
                <h3 style={{color:textColor}}>{translations['your collections']}</h3>
                
                <Card style={{backgroundColor:'transparent'}}>

                <div id='CollectionsWindow' ref={collectionsWindow} style={{display:'flex', justifyContent:'left', flexWrap:'wrap'}}>

                    {processedCollections}
                    {additionMode ? <ItemCard nightMode={nightMode} editMode={deleteMode} addMode={additionMode}/> : null}

                </div>

                    <CardFooter >
                        <hr/>
                            <div style={{color:textColor}} className="stats">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill={textColor} className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                            </svg> {translations['updatedrecently']}
                        </div>
                        
                    </CardFooter>

                </Card>
            </Col>
            </Row>
            <Row>
            </Row>
        </div>
    );
}


const Collections = ({nightMode, languagePack})=>{
    const textColor = nightMode ? 'white' : 'black'
    const If_border = nightMode ? '2px solid white' : null
    
    return (
        <Col lg="3" md="6" sm="6">
                <Card style={{backgroundColor:'transparent', border:If_border}} className="card-stats">
                    <CardBody>
                    <Row>
                        <Col md="4" xs="5">
                        <div className="icon-big text-center icon-warning">
                            <Icons name={'layers'} size={40} color={textColor}/>
                        </div>
                        </Col>
                        <Col md="8" xs="7">
                        <div className="numbers">
                            <p className="card-category" style={{color:textColor}}>{languagePack['collections']}</p>
                            <CardTitle style={{color:textColor}} tag="p">150</CardTitle>
                            <p />
                        </div>
                    </Col>
                </Row>
                </CardBody>
                <CardFooter>
                <hr />
                    <div style={{cursor:'pointer', color:textColor}} className="stats">
                        <i className="fas fa-sync-alt" /> {languagePack['updatenow']}
                    </div>
                </CardFooter>
            </Card>
        </Col>
    )
}

const Items = ({nightMode, languagePack})=>{
    const textColor = nightMode ? 'white' : 'black'
    const If_border = nightMode ? '2px solid white' : null
    return (
            <Col style={{ backgroundColor: 'transparent'}} lg="3" md="6" sm="6">
                <Card  style={{ border: If_border, backgroundColor: 'transparent' }}  className="card-stats">
                    <CardBody>
                        <Row>
                            <Col md="4" xs="5">
                                <div className="icon-big text-center icon-warning">
                                    <Icons name={'items'} size={40} color={textColor}/>
                                </div>
                            </Col>
                            <Col md="8" xs="7">
                            <div className="numbers">
                                <p style={{color:textColor}} className="card-category">{languagePack['items']}</p>
                                <CardTitle style={{color:textColor}} tag="p">1,283</CardTitle>
                                <p/>
                            </div>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter>
                        <hr />
                    <div style={{cursor:'pointer', color:textColor}} className="stats">
                        <i className="fas fa-sync-alt" /> {languagePack['updatenow']}
                    </div>
                    </CardFooter>
                </Card>
            </Col>
    )
}

const Comments = ({nightMode, languagePack})=>{
    const textColor = nightMode ? 'white' : 'black'
    const If_border = nightMode ? '2px solid white' : null
    return (
        <Col style={{ backgroundColor: 'transparent'}} lg="3" md="6" sm="6">
            <Card  style={{ border: If_border, backgroundColor: 'transparent' }}  className="card-stats">
                <CardBody>
                    <Row>
                        <Col md="4" xs="5">
                            <div className="icon-big text-center icon-warning">
                                <Icons name={'chat'} size={40} color={textColor}/>
                            </div>
                        </Col>
                        <Col md="8" xs="7">
                        <div className="numbers">
                            <p style={{color:textColor}} className="card-category">{languagePack['comments']}</p>
                            <CardTitle style={{color:textColor}} tag="p">1,283</CardTitle>
                            <p/>
                        </div>
                        </Col>
                    </Row>
                </CardBody>
                <CardFooter>
                    <hr />
                <div style={{cursor:'pointer', color:textColor}} className="stats">
                    <i className="fas fa-sync-alt" /> {languagePack['updatenow']}
                </div>
                </CardFooter>
            </Card>
        </Col>
    )
}


export function MainBoard(){
    const selectedID = useSelector(Main=>Main.UserSelected.buttonID)
    const selectedLanguage = useSelector(Main=>Main.Languages.SelectedLanguage)
    const translations = useSelector(Main=>Main.Languages.translations[selectedLanguage])
    const dispatch = useDispatch()
    const ButtonUpdate_path = SelectedButton.actions.Update_SelectedButton
    const [nightMode, Update_nightMode] = React.useState(false)
    
    const Select = (id)=>{
        dispatch(ButtonUpdate_path(id))
    }


    const Component_Indecies = {
        1: <All_Collections headerData={translations['mainpage']} callback={Select} nightMode={nightMode}/>,
        2: <PersonalPage nightMode={nightMode}/>,
        3: <Profile nightMode={nightMode}/>
    }

    React.useEffect(Main=>{
        const toggledBefore = JSON.parse(localStorage.getItem('nightMode'))
        if (toggledBefore)
            changeMode({target: {checked: true}})
    }, [])

    const changeMode = (data)=>{
        const body = document.getElementsByTagName('body')
        const checked = data.target.checked
        Update_nightMode(checked)
        body[0].style.backgroundColor = checked ? '#262323' : 'white'
        localStorage.setItem('nightMode', checked)
    }

    const ModeToggle = 
      
    <Switch checked={nightMode} onChange={changeMode}
        sx={(theme: Theme) => ({
            '--Switch-thumbShadow': '0 3px 7px 0 rgba(0 0 0 / 0.12)',
            '--Switch-thumbSize': '24px',
            '--Switch-trackWidth': '50px',
            '--Switch-trackHeight': '25px',
            '--Switch-trackBackground': theme.vars.palette.background.level3,
            [`& .${switchClasses.thumb}`]: {
            transition: 'width 0.2s, left 0.2s',
            },
            '&:hover': {
            '--Switch-trackBackground': theme.vars.palette.background.level3,
            },
            '&:active': {
            '--Switch-thumbWidth': '32px',
            },
            [`&.${switchClasses.checked}`]: {
            '--Switch-trackBackground': 'rgb(48 209 88)',
            '&:hover': {
                '--Switch-trackBackground': 'rgb(48 209 88)',
            },
            },
        })}
    />
    
    return (
        <div className='SideBarStyles'>
    
            <div  className='SidebarBody' id="body-pd">
            
                <div className="l-navbar" id="nav-bar">
                    <nav className="nav">
                        <div>
                            <div className="nav_list"> 
                            <div id='ButtonHeader-bigger'>
                                <small >{translations['globalbutton']}</small>
                            </div>
                                    <a style={{textAlign:'center', cursor:'pointer'}} onClick={()=>Select(1)} className={`nav_link ${selectedID == 1 ? 'active' : null}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-globe" viewBox="0 0 16 16">
                                            <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z"/>
                                        </svg>
                                    </a>
                            <div id='ButtonHeader'>
                                <small>{translations['personalbutton']}</small>
                            </div>
                                <a style={{cursor:'pointer'}} onClick={()=>Select(2)} className={`nav_link ${selectedID == 2 ? 'active' : null}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" className="bi bi-box2-fill" viewBox="0 0 16 16">
                                        <path d="M3.75 0a1 1 0 0 0-.8.4L.1 4.2a.5.5 0 0 0-.1.3V15a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4.5a.5.5 0 0 0-.1-.3L13.05.4a1 1 0 0 0-.8-.4h-8.5ZM15 4.667V5H1v-.333L1.5 4h6V1h1v3h6l.5.667Z"/>
                                    </svg>
                                </a>
                            <div id='ButtonHeader'>
                                <small>{translations['profilebutton']}</small>
                            </div>
                                <a style={{cursor:'pointer'}} onClick={()=>Select(3)} className={`nav_link ${selectedID == 3 ? 'active' : null}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-square" viewBox="0 0 16 16">
                                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12z"/>
                                    </svg>
                                </a>
                            </div>
                            
                        </div> 
                        
                        <div>
                
                        </div>
                        
                        <div className="header_img"> 
                            
                            <p> {nightMode ? translations['themes'][0] : translations['themes'][1]}</p>
                            {ModeToggle}
                        </div>
                    </nav>
                    
                </div>
                
                {Component_Indecies[selectedID]}
            </div>
        </div>
    )
}

export const Tag = ({tagName})=>{
    return (
        <div id="invidualTag">
            <Icons name={'cancel'} color={'white'} size={12}/> {tagName}
        </div>
    )
}

export const CollectionReview = ()=>{
    return (
        <>
            <Header header={'Products'}/>

            <div style={{marginTop:'50px'}}>
                <div className="card">
                    <h5 className="card-header">Featured</h5>
                    <div className="card-body">
                        <h5 className="card-title">Special title treatment</h5>
                        <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                        <a href="#" className="btn btn-primary">Go somewhere</a>
                    </div>
                </div>
            </div>
            
  
        </>
    )
}