import React from "react";
import './assets/css/admin.scss'
import Icons from "icons";
import { useSelector, useDispatch } from 'react-redux';
import {IDs, AdminData} from './redux/reducers';
import ClipLoader from "react-spinners/ClipLoader";
import getHost from "host";
import { useNavigate } from 'react-router-dom';
import { DownloadCSV } from "csv";

const host = getHost()

const token = localStorage.getItem('users-token')

const UserTableObject = ({UserObject})=>{
    const All_Selected_IDs = useSelector((stateBase)=>stateBase.AdminBase.selectedIDs);
    const Selected_IDs_update_path = AdminData.actions.update_selected_ID;
    const dispatch = useDispatch();
    const { id, full_name, blocked, is_admin, collections } = UserObject;

    const AddSelected = (tagpoint)=>{
        dispatch(Selected_IDs_update_path([id]));
    };

    React.useEffect(Main=>{console.log(All_Selected_IDs)}, [All_Selected_IDs])

    return (
        <tr>
            <td>
                <div className="custom-control custom-checkbox">
                    <input checked={All_Selected_IDs.includes(id)} onChange={AddSelected} class="form-check-input" type="checkbox" value="" id="FlexCheckBox"/>{id}
                </div>
            </td>
            <td>{full_name}</td>
            <td>{blocked}</td>
            <td>{is_admin ? 'Yes' : 'No'}</td>
            <td>{collections}</td>
        </tr>
    );
}

const CollectionsTableObject = ({CollectionObject})=>{

    const Selected_IDs_update_path = AdminData.actions.update_selected_ID;
    const dispatch = useDispatch();
    const { id, title, category, owner } = CollectionObject;

    const AddSelected = (tagpoint)=>{
        dispatch(Selected_IDs_update_path([id]));
    };

    return (
        <tr>
            <td>
                <div className="custom-control custom-checkbox">
                    <input onChange={AddSelected} class="form-check-input" type="checkbox" value="" id="FlexCheckBox"/>{id}
                </div>
            </td>
            <td><a href={`../Collection/${id}/`}>{title}</a></td>
            <td>{category}</td>
            <td>{owner}</td>
        </tr>
    );
}

const Table = ({UsersTable})=>{
    const Users = useSelector(Main=>Main.AdminBase.users)
    const Collections = useSelector(Main=>Main.AdminBase.collections)
    const AddSelected = (tagpoint)=>{
        if(tagpoint.target.checked)
            console.log(tagpoint.target.objectID);
    };


    const TableFor_Users = (
            <tr>
                <th scope="col">Selected</th>
                <th scope="col">Full Name</th>
                <th scope="col">Blocked</th>
                <th scope="col">Admin</th>
            </tr>
    );

    const TableFor_Collections = (
        <tr>
            <th scope="col">Selected</th>
            <th scope="col">Collection Title</th>
            <th scope="col">Category</th>
            <th scope="col">Owner</th>
        </tr>
);
    var processedUsers = [];
    if (UsersTable)
        processedUsers = Users.map(each=><UserTableObject UserObject={{id:each.id, full_name:each.full_name, blocked:each.blocked, is_admin:each.admin}}/>)
    else
        processedUsers = Collections.map(each=><CollectionsTableObject CollectionObject={{id:each.id, title:each.name, category:each.topic, owner:each.author_name}}/>)
    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                <table className="table table-bordered">
                    
                    <thead>
                        {UsersTable ? TableFor_Users : TableFor_Collections}
                    </thead>

                    <tbody>

                        {processedUsers}

                    </tbody>
                </table>
                </div>
            </div>
        </div>
    )
}

function AdminPanel(){

    const All_Selected_IDs = useSelector((stateBase)=>stateBase.AdminBase.selectedIDs);
    const UsersForCSV = useSelector(Main=>Main.AdminBase.users);
    const Selected_IDs_update_path = AdminData.actions.update_selected_ID;
    const reset_all = AdminData.actions.resetAll
    const UpdateCheckboxes = IDs.actions.ResetCheckboxes
    const update_users = AdminData.actions.Update_users
    const update_collections = AdminData.actions.Update_collections
    const [selectedTable, Update_selectedTable] = React.useState(1)
    const [loadState, update_loadState] = React.useState(false)
    const [UsersAmount, update_UsersAmount] = React.useState(false)
    const [CollectionsAmount, update_CollectionsAmount] = React.useState(false)
    const dispatch = useDispatch()
    const DropdownMenu = React.useRef()
    const SelectedButton_style = {backgroundColor:'rgb(87, 87, 87)', color:'white'}
    const navigate = useNavigate()


    async function CheckIfAdmin(){
        const request = await fetch(host+`/CheckAdmin/`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
            },
        })
        console.log(request.status)
        if (request.status == 200){
            
        }else{

            navigate('../login', {replace:false})
        }
    }

    async function get_Users(){
        const request = await fetch(host+`/GetUsers/`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
            },
        })
        const result = await request.json()
        if (request.status == 200){
            dispatch(update_users(result.users))
        }
    }

    async function get_Collections(){
        const request = await fetch(host+`/users-collections/`)
        const result = await request.json()
        if (request.status == 200){
            dispatch(update_collections(result.collections))
        }
    }

    async function block_user(id_list){
        const request = await fetch(host+`/blockUser/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
            },
            body: JSON.stringify({id_list: id_list})
        }
        )
        const result = await request.json()
        if (request.status == 200){
            const updated_users = result.updated_users
            if (updated_users.selfDestroyed)
                navigate('../login', {replace:false})
            else
            dispatch(update_users(updated_users))
            dispatch(reset_all([]))
        }
    }

    async function Unblock_user(id_list){
        const request = await fetch(host+`/UnblockUser/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
            },
            body: JSON.stringify({id_list: id_list})
        }
        )
        const result = await request.json()
        if (request.status == 200){
            const updated_users = result.updated_users
            dispatch(update_users(updated_users))      
            dispatch(reset_all([]))
        }
    }

    async function Grant_AdminP(id_list){
        const request = await fetch(host+`/GrantAdmin/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
            },
            body: JSON.stringify({id_list: id_list})
        }
        )
        const result = await request.json()
        if (request.status == 200){
            const updated_users = result.updated_users
            dispatch(update_users(updated_users))      
            dispatch(reset_all([]))
        }
    }

    async function Remove_AdminP(id_list){
        const request = await fetch(host+`/RemoveAdmin/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
            },
            body: JSON.stringify({id_list: id_list})
        }
        )
        const result = await request.json()
        if (request.status == 200){
            const updated_users = result.updated_users
            dispatch(update_users(updated_users))      
            dispatch(reset_all([]))
        }
    }

    async function Delete_user(id_list){
        const request = await fetch(host+`/DeleteUser/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
            },
            body: JSON.stringify({id_list: id_list})
        }
        )
        const result = await request.json()
        if (request.status == 200){
            const updated_users = result.updated_users
            if (result.selfDestroyed)
                window.location.pathname = '\../register'
            dispatch(update_users(updated_users))      
            dispatch(reset_all([]))
        }
    }

    React.useEffect(Main=>{
        
        const indices = {
            1: get_Users,
            2: get_Collections,
        }

        indices[selectedTable]()

    }, [selectedTable])

    const ToggleDropdown = ()=>{
        const menu = DropdownMenu.current
        if (menu)
            if (menu.classList.contains('show')) {
                menu.classList.remove('show')
            } else {
                menu.classList.add('show')
            }
    }

    const SelectButton = (tagpoint)=>{
        Update_selectedTable(tagpoint.target.id)
    }

    const BlockUser = ()=>{
        block_user(All_Selected_IDs)
    }
    const UnlockUser = ()=>{
        Unblock_user(All_Selected_IDs)
    }
    const Delete = ()=>{
        Delete_user(All_Selected_IDs)
    }

    const ManagePrivilege = (Grant)=>{
        if (Grant)
            Grant_AdminP(All_Selected_IDs)
        else    
            Remove_AdminP(All_Selected_IDs)
    }

    const SearchField = (
        <div className="input-group">
            <input type="text" className="form-control bg-light border-0 small" placeholder="Search for...(disabled)"
                aria-label="Search" aria-describedby="basic-addon2"/>
            <div className="input-group-append">
                <button className="btn btn-primary" type="button">
                    <Icons name={'search'} size={15}/>
                </button>
            </div>                                 
        </div>
    );

    const ManagementButtons = ({SelectionID})=>(
        <div id="ManagementButtons">
            {SelectionID == 1 ? <button onClick={BlockUser} className="btn btn-danger"><Icons name={'lock'} size={25} color={'white'}/></button> : null}
            {SelectionID == 1 ? <button onClick={UnlockUser} style={{backgroundColor:'black'}} className="btn btn-black"><Icons name={'unlock'} color={'white'} size={25}/></button> : null}
            {SelectionID == 1 || SelectionID == 1 ? <button onClick={Delete} className="btn btn-danger"><Icons name={'trash'} color={'white'} size={25}/></button> : null}
            
        </div>
    );

    const Privileges_DropDown = ({side})=>{
        return (
            <div className="dropdown">
                <a className="btn btn-secondary dropdown-toggle" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Privileges
                </a> 
    
                <div ref={DropdownMenu} className="dropdown-menu" aria-labelledby="dropdownMenuLink">
    
                    <p onClick={()=>ManagePrivilege(0)} className="privilage">Remove Admin Privilege</p>
                    <p onClick={()=>ManagePrivilege(1)} className="privilage redPermission">Grant Admin Privileges</p>
    
                </div>
            </div>
        )
    }

    const Message = ({type, text})=>{
        return (
            <div style={{textAlign:'center'}} className={`alert alert-${type}`} role="alert">
                {text}
            </div>
        )
    }

    async function animateAmount(max, state, speed=50) {
        for (let i = max*10; i >= max; i--) {
          await new Promise((resolve) => {
            setTimeout(() => {
                state(i);
              resolve();
            }, speed);
          });
        }
    }

    React.useEffect(MAin=>{
        setTimeout(() => {
            animateAmount(9, update_loadState, 5);
        }, 3499);
        setTimeout(() => {
            animateAmount(17, update_UsersAmount, 15);
            animateAmount(36, update_CollectionsAmount, 5);
        }, 1999);
    }, [])

    React.useEffect(Main=>{
        CheckIfAdmin()
    }, [])

    return (
        <div id="page-top">
            <div id="wrapper">

                <div id="content-wrapper" className="d-flex flex-column">

                    <div id="content">
                        
                        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

            
                            <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                                <i className="fa fa-bars"></i>
                            </button>
                                
                    
                            <a className="profileView" href="#" id="profileView" role="button"
                                data-toggle="" aria-haspopup="true" aria-expanded="false">
                                <img className="rounded-circle"
                                    src="https://media.licdn.com/dms/image/C4D0BAQFvejl3pZ83Tg/company-logo_200_200/0/1626164565627/itransition_logo?e=2147483647&v=beta&t=XK-9YsmZcjokSnETbTvVC3sQrDia2AfxkR-6jqxoLvE"/>
                                <span className="mr-2 d-none d-lg-inline text-gray-600 small">Advanced Access</span>
                            </a>

                        </nav>


                        <div className="container-fluid">


                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Admin Panel</h1>
                                <a onClick={()=>DownloadCSV(UsersForCSV, 'exported_data.csv')} href="#" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i
                                        className="fas fa-download fa-sm text-white-50"></i> Selected Users To CSV</a>
                            </div>
        

                            <div className="row">


             

                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card border-left-success shadow h-100 py-2">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                            <div className="text-xs font-weight-bold text-success text-uppercase mb-1">Total Users</div>
                                                { UsersAmount ? <> <div className="col mr-2">
                                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">{UsersAmount}</div>
                                                                    </div>
                                                                    <div className="col-auto">
                                                                    <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                                                                    </div>
                                                                </> :  <ClipLoader color="#36d7b7" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card border-left-info shadow h-100 py-2">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Database Capacity
                                                    </div>
                                                    
                                                    <div className="row no-gutters align-items-center">
                                                        {loadState ? <> <div className="col-auto">
                                                                        <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">{loadState}%</div>
                                                                        </div>
                                                                        <div className="col">
                                                                        <div className="progress progress-sm mr-2">
                                                                        <div className="progress-bar bg-info" role="progressbar"
                                                                            style={{width:`${loadState}%`}} aria-valuenow="50" aria-valuemin="0"
                                                                            aria-valuemax="100"></div>
                                                                                
                                                                        </div>
                                                                        </div>
                                                                     </>  : <ClipLoader color="#36d7b7" />}
                                                    </div>
                                                </div>
                                                <div className="col-auto">
                                                    <i className="fas fa-clipboard-list fa-2x text-gray-300"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card border-left-warning shadow h-100 py-2">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                            <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">Total Collections</div>
                                            {CollectionsAmount ?  <>
                                                                        <div className="col mr-2">
                                                                        
                                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">{CollectionsAmount}</div>
                                                                        </div>
                                                                        <div className="col-auto">
                                                                        <i className="fas fa-comments fa-2x text-gray-300"></i>
                                                                        </div> 
                                                                 </> :  <ClipLoader color="#36d7b7" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                        
                                    <div className="col-xl-4 col-lg-5">
                                            <div className="card shadow mb-4">

                                                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                                        <h6 className="m-0 font-weight-bold text-primary">DataBase Tables</h6>
                                                </div>
                            
                                                    <div className="card-body">
                                                        <p onClick={SelectButton} id="1" style={selectedTable == 1 ? SelectedButton_style : null} className="databaseTable">Users</p>
                                                        <p onClick={SelectButton} id="2" style={selectedTable == 2 ? SelectedButton_style : null} className="databaseTable">Collections</p>
                                                    </div>
                                                </div>
                                    </div>
                                    
                                    <div className="col-xl-8 col-lg-7">
                                            <div className="card shadow mb-4">
                                            
                                                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                                
                                                <div style={{marginRight:'25px'}} onClick={ToggleDropdown} className="dropdown show">

                                                <h1>{!selectedTable ? <h4>No DB Table Selected</h4> : null}</h1>

                                                {selectedTable == 1 ? <Privileges_DropDown/> : null}
                                                
                                            </div>
                             
                                        <div className="dropdown no-arrow"> 
                                            
                                            <ul className="nav-item dropdown no-arrow mx-1">
                                            
                                            {selectedTable  ? SearchField : null}
                                        </ul>
                                

                                            </div>
                                            
                                            </div>

                                                <ManagementButtons SelectionID={selectedTable}/>

                                            {selectedTable == 2 ? <div class="alert alert-warning" role="alert">Click On The Collection Title To Edit</div> : null}
                                            
                                            <div className="card-body resultsArea">
                                                <div className="chart-area">

                                                   {selectedTable ? <Table UsersTable={selectedTable == 1 ? true : false}/> : null}
                                                   
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

            
                            </div>


                    </div>



                    <footer className="sticky-footer bg-white">
                        <div className="container my-auto">
                            <div className="copyright text-center my-auto">
                                <span>Project Defence!</span>
                            </div>
                        </div>
                    </footer>
        

                </div>


            </div>

  

        </div>


    )
}

export default AdminPanel;  