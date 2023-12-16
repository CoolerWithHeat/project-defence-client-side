import './assets/css/reviewPort.scss'
import Icons from "./icons";
import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useParams } from 'react-router-dom';
import Header from "globalCollections";
import getHost from 'host';
import FieldComponent from 'ItemFields';
import Markdown from 'react-markdown';

const host = getHost()

const token = localStorage.getItem('users-token')

const CollectionCard = ({collectionID})=>{

    const [collection, update_collection] = React.useState()
    async function get_Collection_Details(){
        const request = await fetch(host+`/GetCL/`, {
            method:'POST',
            headers: {
                'Authorization': `Token ${token}`,
            },
            body: JSON.stringify({id: collectionID}),
        })
        const result = await request.json()
        if (request.status == 200){
            update_collection(result.collection)
        }else{
            window.location.pathname = '\../register'
        }
    }

    React.useEffect(Main=>{

        get_Collection_Details()

    }, [])

    return (
        <div class="card">
            {collection ? 
                <>
                    <div class="card-header">
                        {collection.name} collection
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">
                            ↓Description (mark-down) 
                        </h5>
                        <Markdown>{collection.description}</Markdown>
                    </div> 
                    </>
                : null
            }
        </div>
    )
}

function InsideCollection({}){
    const {collectionID} = useParams();
    const [Completed, update_Completed] = React.useState(false)
    const [items, update_items] =  React.useState([])
    const [additionMode, update_additionMode] =  React.useState(false)
    const is_nightMode = true
    const textColor = is_nightMode ? 'white' : '#343a40'


    const LightMode = {
        backgroundColor: "dark",
        background: "-webkit-linear-gradient(to left, #dd5e89, #f7bb97)",
        background: "linear-gradient(to left, #dd5e89, #f7bb97)",
        minHeight: "100vh",
        marginTop:'6.5vh'
    };

    const DarkMode = {
        background: "#4D4D4D",
        minHeight: "100vh",
    };

    async function get_Collection_Items(){
        const request = await fetch(host+`/Get-All-Items/${collectionID}/`,
        {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
                },
            }
        )
        const result = await request.json()
        if (request.status == 200){
            update_items(result.items)
        }else{
            window.location.pathname = '\../register'
        }
    }

    const ItemObject = ({id, title})=>{
        const [editMode, Update_editMode] = React.useState(false)
        const [is_requesting, update_is_requesting] = React.useState(false)
        const [name, update_name] = React.useState()

        async function deleteItem(){
            update_is_requesting(!is_requesting)
            setTimeout(() => {
                update_Completed('Deleted!')
                update_is_requesting(!is_requesting)
            }, 999);
        }
        
        const Edit = ()=>{
            Update_editMode(!editMode)
        }

        function makeChanges(action){
            async function Delete(){
                const request = await fetch(host+`/delete_item/${id}/`,
                {
                    method:'POST',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                    }
                )
                const result = await request.json()
                if (request.status == 200){
                    const updated_id = result.id
                    const UpdatedItems = items.filter(each=>{
                        return each.id == updated_id ? false : true
                    })
                    update_items([...UpdatedItems])
                }else{
                    window.location.pathname = '\../register'
                }
            }
            async function Edit(){
                const data = document.getElementById('editingfield').value
                const request = await fetch(host+`/edit_item/${id}/`,
                {
                    method:'POST',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json',

                        },
                    body:JSON.stringify({name: data})
                }
                )
                const result = await request.json()
                if (request.status == 200){
                    const updated_id = result.item.id
                    const UpdatedItems = items.filter(each=>{
                        return each.id == updated_id ? false : true
                    })
                    update_items([...UpdatedItems, result.item])
                }else{
                    window.location.pathname = '\../register'
                }
            }
            const action_indecies = {
                'delete':[Delete, 'Deleted!'],
                'edit' : [Edit, 'Changes saved!']
            }
            update_is_requesting(true)

            setTimeout(() => {
                action_indecies[action][0]()
                update_Completed(action_indecies[action][1])
            }, 777);
        }

        const itemTitle = editMode ? <input style={{width:'65px'}} defaultValue={title} class="form-control form-control-sm" id={'editingfield'}/> : title

        const saveButton = (
            <li class="list-inline-item">
                    <button onClick={is_requesting ? null : ()=>makeChanges('edit')} class="btn btn-success btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Edit">
                        {is_requesting ? <ClipLoader size={15} color="white"/> : 'save'}
                    </button> 
            </li>
        )

        
        return (
            <tr> 
                <td style={{color:textColor}}>{id}</td>
                <td style={{color:textColor}}><a id="ItemLink" href={editMode ? null : `../../../ItemView/${id}/`}>{itemTitle}</a></td>
                <td style={{color:textColor}}>{'You'}</td>
            <td>
                <ul class="list-inline m-0">

                    {editMode ? saveButton :  
                        <>
                            <li class="list-inline-item">
                                <button onClick={Edit} class="btn btn-success btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Edit">
                                    <Icons name={'special_edit'} size={18} color={'white'}/>
                                </button>
                            </li>

                            <li class="list-inline-item">
                                <button onClick={()=>makeChanges('delete')} class="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Delete">
                                    { is_requesting ? <ClipLoader size={15} color="white"/> : <Icons name={'trash'} size={18} color={'white'}/>}
                                </button>
                            </li>
                        </>
                    }
                    
                </ul>
            </td>
        </tr>
        )
    }

    async function animateDiv() {
        await new Promise(resolve => {
        setTimeout(() => {
            const animatedDiv = document.getElementsByClassName('LoadingField')[0];
            if (animatedDiv)
                animatedDiv.classList.add('hide');
                resolve();
        }, 999);
        });
    
        await new Promise(resolve => {
        setTimeout(() => {
            update_Completed(null);
            resolve();
        }, 999);
        });
    }

    const processedItems = items.map(each=>{
        return <ItemObject id={each.id} title={each.name} author={!each.author ? 'You' : each.author}/>
    }) 

    function Addition_Window(){
        const [custom_fields, update_custom_fields] = React.useState([])

        async function get_customFields(){
            const request = await fetch(host+`/getCustomFields/${collectionID}/`,
            {
                method:'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    },
                }
            )
            const result = await request.json();
            if (request.status == 200){
                update_custom_fields([...result]);
            }else{
                window.location.pathname = '\../register'
            }
        }

        async function CreateItem(data){
            const request = await fetch(host+`/CreateIT/${collectionID}/`,
            {
                method:'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                    
                    },
                body:JSON.stringify(data),
                }

            )
            const result = await request.json()
            if (request.status == 200){
                update_Completed('Created!')
                update_additionMode(!additionMode)
            
            }else{
                window.location.pathname = '\../register'
            }
        }
        

        React.useEffect(Main=>{get_customFields()}, [])
        return (
            <div id='additionWindow'>
                <FieldComponent fieldData={custom_fields} callback={CreateItem}/>
            </div>
        )
    }

    const Product_Management_window =   <div>
                                            <h6 >Items of this Collection</h6>
                                            <div onClick={()=>update_additionMode(!additionMode)} id='AddIconClosure'>
                                                <Icons name={'add'} color={'white'}/>
                                            </div>
                                            
                                            <div class="table-responsive">
                                                <table class="table m-0">
                                                    <thead >
                                                        <tr>
                                                            <th style={{color:textColor}} scope="col">id</th>
                                                            <th style={{color:textColor}} scope="col">Title</th>
                                                            <th style={{color:textColor}} scope="col">Author</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {processedItems}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

    React.useEffect(()=>{
        if(Completed)
            animateDiv();
    }, [Completed])

    React.useEffect(Main=>{get_Collection_Items()}, [Completed])

    return (
        <div style={is_nightMode ? DarkMode : LightMode}  id="InsideCollection">
            <Header hideButtons={true} header={'inside Collection'} nightMode={is_nightMode}/>
                <section  class="reviewField withNightMode">
                        <div class="container py-5 text-white">
                        
                        <div class="row">
                        <CollectionCard collectionID={collectionID}/>
                            <div class="col-lg-7 mx-auto" >
                                <div style={{backgroundColor:is_nightMode ? '#343a40' : 'white', color:textColor}} class="card border-0 shadow">
                                    {Completed ? <div className="LoadingField">{Completed}</div> : null}
                                
                                    
                                    <div  class="card-body p-5">
                                        {additionMode ? <Addition_Window/> : Product_Management_window}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
            </section>
</div>
)
}

export default InsideCollection;