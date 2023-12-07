import React from 'react';
import { Tag } from './coreComponents';
import ReconnectingWebSocket from 'reconnecting-websocket';
import getHost from 'host';
import './assets/css/itemCreation.scss'

const host = getHost(false);

function capitalizeFirstLetter(input) {
  return String(input.charAt(0)).toUpperCase() + input.slice(1);
}

function FieldComponent({ fieldData, callback }) {

  const [custom_fields_data, update_fields] = React.useState({})
  const [selected_tags, update_selected_tags] = React.useState([])
  const [suggested_tags, update_suggested_tags] = React.useState([])
  const title = React.useRef(null);
  const TaginputRef = React.useRef(null);
  const socket = React.useRef(null);

  function SubmitBack(){
    if (title.current){
      callback({name:title.current.value, additionalFields:custom_fields_data, tags:[...selected_tags]})
      console.log({name:title.current.value, additionalFields:custom_fields_data, tags:[...selected_tags]})
    }
  }

  function add_unsuggested_tag(){
    const input = TaginputRef.current.value;
    if (input)
      update_selected_tags([...selected_tags, capitalizeFirstLetter(input)])
      TaginputRef.current.value = null;
  }

  const AddTag = (tagpoint, name)=>{
    update_selected_tags(selected_tags.includes(name) ? selected_tags : [...selected_tags, name]);
    update_suggested_tags([]);
    if (TaginputRef.current)
      TaginputRef.current.value = null;
  }

  const removeTag = (tag_name)=>{
    const updated_tags = selected_tags.filter(each=>!(each==tag_name))
    update_selected_tags(updated_tags)
  }

  const processedSuggestions = suggested_tags.map(each=><p id='TagClosure' onClick={(event) => AddTag(event, each)}>{each}</p>)
  const processedSelected_Tags = selected_tags.map(each=><div onClick={()=>removeTag(each)}><Tag key={each} tagName={each}/></div>)

  const changeHandler = (tagPoint)=>{
    const field_name = tagPoint.target.name;
    const field_data = tagPoint.target.type === 'checkbox' ? tagPoint.target.checked : tagPoint.target.value;
    update_fields({...custom_fields_data, [String(field_name)]:field_data})
  }

  const AskSocket = (tagpoint)=>{
    const users_text = tagpoint.target.value
    if (socket.current && users_text)
      socket.current.send(JSON.stringify({keyword:users_text}))
    else
      update_suggested_tags([])
  }

  const RenderFields = () => {

    const textRef = React.useRef()
    return fieldData.map(([dataType, name]) => {
      const renderField = () => {
        switch (dataType) {
          case 'multi text':
            return <textarea onChange={changeHandler} className='form-control' name={name} />
          case 'checkbox':
              return <div ><input style={{marginLeft:'35px'}} type='checkbox' className="form-check-input" onChange={changeHandler} name={name} /></div>
          case 'integer':
            return <input onChange={changeHandler} className='form-control' type="number" name={name} />;
          case 'string':
            return <input onChange={changeHandler} className='form-control' type="text" name={name} />;
          case 'date':
            return <input onChange={changeHandler} className='form-control' type="date" name={name} />;
          default:
            return null;
        }
      };

      return (
        <div key={name}>
          
          <hr/>
          <label htmlFor={name}>{String(name).toUpperCase()}</label>
          {renderField()}
          
        </div>
      );
    });
  };

  React.useEffect(Main=>{
    socket.current = new ReconnectingWebSocket(host+'/search/')
    return () => {
      socket.current.close();
    };
  }, [])


  
  React.useEffect(Main=>{
    if (socket.current)
      socket.current.onmessage = (flow)=>{
        const received_data = JSON.parse(flow.data).result || null
        update_suggested_tags(received_data)
    }
  }, [])

  return  <div id='itemCreation'>
              <input placeholder='Name' ref={title} className='form-control' type="text" name='name' />
                {RenderFields()}
              <hr/>

              <div id="TagsOverall">
              <div id='TagAddition'>
                    <div id='TagSearchField'>
                      <input ref={TaginputRef} onChange={AskSocket} placeholder='search tags' className='form-control'/>
                      {suggested_tags[0] ? 
                        <div id='suggestionBoard'>
                          {processedSuggestions}
                        </div> : null}
                    </div>
                    <button onClick={add_unsuggested_tag} className='btn btn-warning'>Add</button>
                </div>
                    <h3 id="tagHeader" className="display-6">Tags</h3>
                    <div id="tagsClosure">
                        <div className="tagElement">
                          {processedSelected_Tags}
                        </div>
                    </div>
                </div>
              <button onClick={SubmitBack} className='btn btn-primary'>Create</button>
          </div>;
}

export default FieldComponent;