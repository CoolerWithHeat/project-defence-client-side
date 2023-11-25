import React from "react";
import { useParams } from 'react-router-dom';
import './assets/css/itemView.scss'
import Icons from "./icons";
import Header from "globalCollections";
import { Tag } from './coreComponents';
import getHost from "host";
import ReconnectingWebSocket from "reconnecting-websocket";
import itransitionLogo from './assets/img/triansitionLogo.jpg';

const host = getHost()
const socket_host = getHost(false)
const token = localStorage.getItem('users-token')

function isBoolean(data) {
    console.log(typeof data === 'boolean')
    return typeof data === 'boolean';
}

const CustomField = ({FieldData})=>{
    const booleanData = isBoolean(FieldData[1]);
    const interpretation = booleanData ? (FieldData[1] ? 'YES' : 'NO') : FieldData[1]
    return (

        <div className="d-flex justify-content-between p-price"><span>{FieldData[0]}</span><span>{interpretation}</span></div>

    )
}

const Message = ({text})=>{
    return (
        <div id="MessageWindow" className="success">
            <p>{text}</p>
        </div>
    )
}

const Item = ({id, data})=>{
    const bodyData = data;
    const collection_belongs_to = bodyData.collection;
    const name = bodyData.name;
    const tags = bodyData.tags ? bodyData.tags.map(each=><Tag key={each} tagName={each}/>) : null; 
    const additional_fields = Object.keys(bodyData.additional_field_data).map(each=>[each, bodyData.additional_field_data[each]]);
    const [liked, update_liked] = React.useState(false)
    const [fields, update_item_details] = React.useState()
    const [UserMessage, Update_Message] = React.useState()
    const [CommentRequested, update_CommentRequested] = React.useState(false)
    const processedFields = additional_fields.map(each=><CustomField FieldData={each}/>)
    
    async function Get_Item_Properties(){
        const request = await fetch(host+`/getItem/${id}/`)
        const result = await request.json()
        if (request.status == 200){
            update_item_details(result.item)
        }
    }

    async function SaveComment(data){
        const request = await fetch(host+`/LeaveComment/${id}/`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({text: data})
            },
        )
        if (!request.status == 200){
            window.location.pathname = '\../register'
        }

        if (request.status == 200){
            Update_Message(<Message text={'Done!'}/>)
        }
    }   

    React.useEffect(Main=>{
        setTimeout(() => {
            Update_Message(null)
        }, 1999);
    }, [UserMessage])

    const Comment_Addition_Form = ()=>{
        const InputRef = React.useRef(null)
        const Submit = ()=>{
            if (InputRef.current)
                if (InputRef.current.value)
                    SaveComment(InputRef.current.value)
                    update_CommentRequested(false)
        }
        return (
                <div>
                    <input ref={InputRef} placeholder="Your Comment" className="form-control"/>
                    <button onClick={Submit} className="btn btn-primary" style={{float:'right'}}>Save</button>
                    <hr/>
                </div>
        )
    } 

    React.useEffect(Main=>{
        Get_Item_Properties()
    }, [])

    return (
        <div>
                        
            <Header hideButtons={true} header={'Item View'} nightMode={true}/>
            <br/>
            <br/>
            <hr/>
     
        
        <div  className="d-flex justify-content-center container mt-5">
            <div id="CardBody">
                <div  className="about-product text-center mt-2">
                    
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq75HPRkR6cgUI9C_2bWPnb9cYtPjS09uldNf9Uwx1uCJhdabLFUMLq-uOj6c28aV_9uo&usqp=CAU" width="300"/>
                    <hr/>
                    
                    <div id="likeClosure" onClick={()=>update_liked(!liked)}>
                        <Icons size={22} animationID={liked ? 'LikeButton' : 'unliked'} onClick={()=>update_liked(!liked)} name={liked ? 'like_filled' : 'like_empty'} color={liked ? '#20c997' : 'red'}/>
                    </div>

                    <div id="MessageClosure">
                        {UserMessage}
                    </div>
                    
                    <div >   
                        <h4 id="title" className="display-6">{name}</h4>
                        <h6 className="mt-0">Item of collection {collection_belongs_to}</h6>
                    </div>
               
                </div>
                <div className="stats mt-2">
                    <div className="d-flex justify-content-between p-price"><span>ID</span><span>{id}</span></div>
                    {processedFields}
                        <div id="TagsOverall">
                            <h3 id="tagHeader" className="display-6">Tags</h3>
                            <div id="tagsClosure">
                                <div className="tagElement">
                                    {tags.length ? tags : <h5>no tags</h5>}
                                </div>
                            </div>
                        </div>
                    <hr/>
                </div>

                { !CommentRequested ? <div class="d-flex justify-content-between total font-weight-bold mt-4">
                    <span>Comments <Icons size={15} color={'#20c997'} name={'chat'}/></span>
                    <span style={{cursor:'pointer'}} onClick={()=>update_CommentRequested(!CommentRequested)}><Icons name={'add'} size={25} color={'white'}/>
                    </span>
                </div> : <Comment_Addition_Form/>}
            </div>
  
        </div>
        
        </div>
    )
}

const Comment = ({commenter, date, text})=>{
    return (
        <div id="commentObject" >
            <div className="d-flex justify-content-center py-2">
                <div className="second py-2 px-2"> <span className="text1">{text}</span>
                    <div className="d-flex justify-content-between py-1 pt-2">
                    <div><img src={itransitionLogo} width="18"/>
                        <span className="text2">{commenter}</span>
                    </div>
                    <div>
                        <span className="text3">{date}</span>
                        <span className="thumbup">
                            <i className="fa fa-thumbs-o-up"></i>
                        </span>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ItemView(){
    const {itemID} = useParams();
    const validID = !isNaN(parseInt(itemID.slice(-1)))
    const [comments, update_comments] = React.useState([])
    const [itemData, update_itemData] = React.useState()

    React.useEffect(()=>{
        const body = document.body
        body.style.backgroundColor = 'rgb(44, 44, 44)'
        const socket = new ReconnectingWebSocket(socket_host+`/comments-flow/${itemID.slice(-1)}/`)
        socket.onmessage = (flow)=>{
            const new_comment = JSON.parse(flow.data).comment
            console.log(new_comment)
            update_comments(Previous=>[...Previous, new_comment])
        }
    }, [])

    async function GetItem(id){
        const request = await fetch(host+`/getItem/${id}/`)
        const result = await request.json()
        if (request.status == 200){
            update_itemData(result.item)
            update_comments([...result.comments])
        }
    }

    React.useEffect(Main=>{
        GetItem(itemID.slice(-1))
    }, [])
    
    const processedComments = comments.map(each=>{
        console.log(each.id)
        return <Comment key={each.id} text={each.text} date={each.date} commenter={each.commenter}/>})
    if (validID)
        return (
            <div className="itemView nightMode-Item">
                {itemData ? <Item key={itemID.slice(-1)} data={itemData} id={itemID.slice(-1)}/> : null}
                <div className="userComments">    
                    {processedComments}
                </div>
            </div>
        )
    else    
        return <h1 id="ErrorMessage">Invalid Params!</h1>
}


export default ItemView;