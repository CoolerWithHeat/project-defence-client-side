import './assets/css/main.scss'
import defaultItem from './assets/img/itemDefault.png'
import defaultCollection from './assets/img/collectionDefault.jpg'
import './tagcloud/style.scss'
import { TagCloud } from 'react-tagcloud'
import { useSelector, useDispatch } from 'react-redux';
import React from 'react'
import { UserSearched_Keyword } from 'globalCollections'
import getHost from 'host'

const host = getHost()

export function checkArrays(items, collections, comments) {
    const arrays = [items, collections, comments];
    const allArraysTruthy = arrays.every(arr => Array.isArray(arr) && arr.length > 0);
    return allArraysTruthy;
  }

const SearchCollection = ({id, topic, name, image})=>{
    return (
            <div className="box">
                <a className="image fit"><img src={image} alt="" width="600" height="338"/></a>
                <div className="inner">
                    <h3>{name}</h3>
                    <a href={`\../collection/${id}/`} className="button fit" data-poptrox="youtube,800x400">View now</a>
                </div>
            </div>
    )
}

const CommentForm = ({id, text})=>{
    return (
        <a href={`\../ItemView/${id}`}>
            <div className="card text-white bg-primary mb-3" style={{'maxWidth': '18rem'}}>
                <div className="card-header">Comment</div>
                <div className="card-body">
                    <h5 className="card-title">Found Keyword ↓</h5>
                    <p className="card-text">{text}</p>
                </div>
            </div>
        </a>
    )
}

  
export function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

const TagsCloud = ()=>{
    
    let list = [];

    for (let i = 1; i <= 20 ; i++){
        list.push(getRandomNumber(10, 50));
    }

    const processedObjs = list.map(data=><p style={{fontSize:`${data}px`}} className="CloudElement">ass</p>)
    return (
        <div id="tagscloud">
            <p style={{fontSize:'20px'}} className="CloudElement">ass</p>
            {processedObjs}
        </div>
    )
}

const Collection = ({id, name})=>{
    const translations = useSelector(Main=>Main.Languages.translations)
    return (
        <div className="box">
            <a className="image fit"><img src={defaultCollection} alt="" width="600" height="338"/></a>
            <div className="inner">
                <h3>{name}</h3>
                <a href={`\../ItemView/${id}/`} className="button fit" data-poptrox="youtube,800x400">{translations['viewnow']}</a>
            </div>
        </div>
    )
}


const Item = ({id, name})=>{
    return (
        <div className="box">
            <a className="image fit"><img src={defaultItem} alt="" width="600" height="338"/></a>
            <div className="inner">
                <h3>{name}</h3>
                <a href={`\../ItemView/${id}/`} className="button fit" data-poptrox="youtube,800x400">View now</a>
            </div>
        </div>
    )
}

const MainShow = ()=>{
    const selectedLanguage = useSelector(Main=>Main.Languages.SelectedLanguage)
    const translations = useSelector(Main=>Main.Languages.translations[selectedLanguage])
    const [latestItems, update_latestItems] = React.useState([])
    const [largestCollections, update_largestCollections] = React.useState([])
    const [tags, update_tags] = React.useState([])
    async function get_data(){
        const request = await fetch(host+`/MainDisplayData/`)
        const result = await request.json()
        if (request.status == 200){
            update_latestItems(result.items)
            update_largestCollections(result.collections)
            update_tags(result.tags)
        }
    }
    React.useEffect(Main=>{get_data()}, [])
    const processedItems = latestItems.map(each=><Item id={each.id} name={each.name}/>)
    const processedCollections = largestCollections.map(each=><Collection id={each.id} name={each.name}/>)
    const tagData = tags.map(each=>{return {value:each, count: Math.floor(Math.random() * (40 - 20 + 1)) + 15}})
    return (
        <div className='showcasePage'>
            <div className="inner">
                <div className='sectionHeader'>{translations['latestitems']}</div> 
                <br/>
                <div className="thumbnails">
                
                    {processedItems} 

                </div>
                <div className='sectionHeader'>{translations['latestcollections']}</div>
                <br/>
                <div className="thumbnails">
            
                    {processedCollections}

                </div>
                <TagCloud
                    minSize={12}
                    maxSize={31}
                    tags={tagData}
                    onClick={tag=>{
                        const url = new URL(window.location.protocol+'//'+window.location.host+'/Main');
                        url.searchParams.set('keyword', tag.value);
                        window.location.href = url.toString();
                    }}
                />
            </div>
        </div>
    )

}

function ShowcasePage({nightMode}){
    const textColor = nightMode ? 'white' : 'black'
    const SearchResult = useSelector(Base=>Base.SearchResult.Result_Query)
    const items = SearchResult.items ? SearchResult.items.map(each=><Item key={each.id} name={each.name} id={each.id}/>) : []
    const collections = SearchResult.collections ? SearchResult.collections.map(each=><SearchCollection key={each.id} name={each.name} id={each.id} image={each.image ? each.image : defaultCollection} topic={each.topic}/>) : [] 
    const comments = SearchResult.comments ? SearchResult.comments.map(each=><CommentForm key={each.id} id={each.id} text={each.text} />) : [];
    const SearchedKey = UserSearched_Keyword()
    const WrapData = (data, Name)=>{
        return (
            <div className="showcasePage">
                <h1 className='display-6' style={{color:textColor}}>{data.length === 0 ? null : `Found ${Name}`}</h1>
                <div className="thumbnails">
                    {data}
                </div>
            </div>
        )
    }

    React.useEffect(Main=>{console.log(nightMode)}, [])
    return (
        <>
            {SearchedKey ?  WrapData(items, 'Items') : null}
            {SearchedKey ?  WrapData(collections, "Collections") : null}
            {SearchedKey ?  WrapData(comments, "Comments") : null}
            {!SearchedKey ? <MainShow/> : null}
        </>
    )
}

export default ShowcasePage;