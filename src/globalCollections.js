import React from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import {SearchResult} from './redux/reducers';
import ReconnectingWebSocket from "reconnecting-websocket";
import { SelectedButton } from 'redux/reducers';
import {LanugageToggle} from './coreComponents'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  InputGroup, 
  InputGroupText,
  InputGroupAddon,
  Input,
} from "reactstrap";
import getHost from 'host';


export function UserSearched_Keyword(){
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);
  const keywordValue = searchParams.get('keyword');
  return keywordValue
}

const host = getHost()
const socketHost = getHost(false)

function Header(props) {
  const selectedLanguage = useSelector(Main=>Main.Languages.SelectedLanguage)
  const translations = useSelector(Main=>Main.Languages.translations[selectedLanguage])
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [Searched, updated_Search_status] = React.useState();
  const [recommendedTags, updated_recommendedTags] = React.useState([]);
  const selectedID = useSelector(Main=>Main.UserSelected.buttonID);
  const dispatch = useDispatch();
  const ButtonUpdate_path = SelectedButton.actions.Update_SelectedButton;
  const SearchResult_Update_Path = SearchResult.actions.Update_SearchResult;
  const [color, setColor] = React.useState("transparent");
  const sidebarToggle = React.useRef();
  const location = useLocation();
  const [KeyWord, Update_KeyWord] = React.useState();
  const iconRef = React.useRef();
  const socketRef = React.useRef();
  const SearchRef = React.useRef();
  const textColor = props.nightMode ? 'white' : 'black';
  const iconColor = props.nightMode ? 'black' : 'white';

  const Search = ()=>{
    updated_Search_status(!Searched)
  }
  
  const toggle = () => {
    if (isOpen) {
      setColor("transparent");
    } else {
      setColor("dark");
    }
    setIsOpen(!isOpen);
  };

  const dropdownToggle = (e) => {
    setDropdownOpen(!dropdownOpen);
  };

  const openSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    sidebarToggle.current.classList.toggle("toggled");
  };

  const updateColor = () => {
    if (window.innerWidth < 993 && isOpen) {
      setColor("dark");
    } else {
      setColor("transparent");
    }
  };

  const HandleInputChange = (tagpoint)=>{
    const input = tagpoint.target.value;
    Update_KeyWord(input)
    if (socketRef.current && input)
      socketRef.current.send(JSON.stringify({keyword:input}))
    else
      updated_recommendedTags([])
  }

  async function RequestSearch(data){
    const request = await fetch(host+`/Search/`,
      {
          method: 'POST',
          body: JSON.stringify({keyword: data})
      },
      )
      const result = await request.json()
      if (request.status == 200){
        dispatch(SearchResult_Update_Path(result.search_result))
      }
  }

  const SearchByTag = (tagName)=>{
    const url = new URL(window.location.protocol+'//'+window.location.host+'/Main');
    url.searchParams.set('keyword', tagName);
    window.location.href = url.toString();
  }

  React.useEffect(Main=>{

    const searchedKeyword = UserSearched_Keyword()
    if (searchedKeyword)
      Update_KeyWord(searchedKeyword)
      RequestSearch(searchedKeyword)
    
    
    const toggler = document.getElementsByClassName('navbar-toggler')[0]
    setTimeout(() => {
      toggler.click()
    }, 333);
    
  }, [])

  React.useEffect(Main=>{
    const socket = new ReconnectingWebSocket(socketHost+'/search/')
    socket.onmessage = (flow)=>{
      const suggestion = JSON.parse(flow.data).result
      updated_recommendedTags(suggestion)
    }
    socketRef.current = socket;
  }, [])

  React.useEffect(() => {
    if (Searched){
      const url = new URL(window.location.protocol+'//'+window.location.host+'/Main');
      url.searchParams.set('keyword', KeyWord);
      window.location.href = url.toString();
    }
  }, [Searched])

  React.useEffect(() => {
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      sidebarToggle.current.classList.toggle("toggled");
    }
  }, [location]);
  
  const TriggerSearch = (event)=>{
    if (event.key === "Enter") {
      updated_Search_status(!Searched)
    }
  }

  React.useEffect(() => {
    document.addEventListener("keydown", TriggerSearch);
  }, [])

  const processedTags = recommendedTags.map(Each=><div id="SuggestionTag" onClick={()=>SearchByTag(Each)}>{Each}</div>)

  return (
    <Navbar 
      color="red"
      expand="lg"
      className={
        location.pathname.indexOf("full-screen-maps") !== -1
          ? "navbar-absolute fixed-top"
          : "navbar-absolute fixed-top " +
            (color === "transparent" ? "navbar-transparent " : "")
      }
    >
      <Container fluid>
        <div className="navbar-wrapper">
          <NavbarBrand style={{color:textColor}}>{props.header}</NavbarBrand>
          {props.hideButtons ? null : <LanugageToggle/>}
        </div>
        
        <NavbarToggler onClick={toggle}>
          <span className="navbar-toggler-bar navbar-kebab"/>
          <span className="navbar-toggler-bar navbar-kebab"/>
          <span className="navbar-toggler-bar navbar-kebab"/>
        </NavbarToggler>
        
        <Collapse isOpen={isOpen} navbar className="justify-content-end">
            <div>
                <InputGroup className="no-border">
                  <Input value={KeyWord} style={{color: textColor}} onChange={HandleInputChange} placeholder={`${translations['search']}...`} />
                  <InputGroupAddon addonType="append">
                      <InputGroupText ref={SearchRef} style={{backgroundColor: props.nightMode ? 'white' : '#5E5E5E', opacity:'80%'}} onClick={Search}>
                        <i style={{cursor:'pointer', marginLeft:'10px', color: iconColor}} className="nc-icon nc-zoom-split" />
                      </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>

                {!recommendedTags.length == 0 ? 
                <div id="SuggestionWindow">

                    {processedTags}

                </div>
              : null}

            </div>
            
            <div style={{display:props.hideButtons ? 'none' : null}} className={'MiniBar'}>
                <Dropdown 
                  nav
                    isOpen={dropdownOpen}
                    toggle={(e) => dropdownToggle(!dropdownOpen)} 
                  >
                  
                  <DropdownToggle style={{color:textColor}} caret nav>
                    
                    <i style={{color:'white', zIndex:'99', fontSize:'19px'}} className="nc-icon nc-bell-55" />

                  </DropdownToggle>
                  
                    <DropdownMenu>
                      <DropdownItem style={{float:'left', position:'absolute', left:'-160px', backgroundColor:'black', color:'white', width:'85%'}} tag="a">No Alerts</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                    <div id='ButtonHeader-bigger'>
                        <small>{translations['globalbutton']}</small>
                    </div>
                    <a style={{cursor:'pointer'}} onClick={()=>dispatch(ButtonUpdate_path(1))} className={`nav_link ${selectedID == 1 ? 'active' : null}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-globe" viewBox="0 0 16 16">
                            <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z"/>
                        </svg>
                    </a>
                    <div id='ButtonHeader-bigger'>
                        <small>{translations['personalbutton']}</small>
                    </div>
                    <a style={{cursor:'pointer'}} onClick={()=>dispatch(ButtonUpdate_path(2))} className={`nav_link ${selectedID == 2 ? 'active' : null}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" className="bi bi-box2-fill" viewBox="0 0 16 16">
                            <path d="M3.75 0a1 1 0 0 0-.8.4L.1 4.2a.5.5 0 0 0-.1.3V15a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4.5a.5.5 0 0 0-.1-.3L13.05.4a1 1 0 0 0-.8-.4h-8.5ZM15 4.667V5H1v-.333L1.5 4h6V1h1v3h6l.5.667Z"/>
                        </svg>
                    </a>
                    <div id='ButtonHeader-bigger'>
                        <small>{translations['profilebutton']}</small>
                    </div>
                    <a style={{cursor:'pointer'}} onClick={()=>dispatch(ButtonUpdate_path(3))} className={`nav_link ${selectedID == 3 ? 'active' : null}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-square" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12z"/>
                        </svg>
                    </a>
                    <div>
                    </div>
                    
    
            </div>
          
        </Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;