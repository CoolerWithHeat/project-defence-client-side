import { createSlice, configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux';


export const IDs = createSlice({

    name: 'ID_base',

    initialState: {

        full_ID: [],
        Selected_IDs: [],

    },
    
    reducers: {

        Update_SelectedCheckboxes: (state, action) => {
            const addition = action.payload[0];
            const data = action.payload[1];
            if (addition) {
                state.Selected_IDs = [...state.Selected_IDs, data];
            }else{
                const sortedIds = state.Selected_IDs.filter(item => item !== data);
                state.Selected_IDs = [...sortedIds]
            }
        },

        ResetCheckboxes: (state, action) => {
            if (action.payload) {
                state.Selected_IDs = [];
            }
        },

    },
});



export const SearchResult = createSlice({

    name: 'SearchBase',
    
    initialState: {
        Result_Query: [],
    },

    reducers: {
        Update_SearchResult: (state, action) => {
            if (action.payload)
                state.Result_Query = {...action.payload}
        },
    },
  });

export const SelectedButton = createSlice({

    name: 'ChosenButton',
    
    initialState: {
        buttonID: 1,
    },

    reducers: {
        Update_SelectedButton: (state, action) => {
            if (action.payload)
                state.buttonID = action.payload
        },
    },
  });


export const AdminData = createSlice({

    name: 'AdminInformation',
    
    initialState: {

        collections: [],
        selectedIDs :[],
        users: [],


    },



    reducers: {
        Update_collections: (state, action) => {
            if (action.payload)
                state.collections = [...action.payload]
        },

        update_selected_ID: (state, action) => {
            if (action.payload) {
              const newSelectedIDs = [...state.selectedIDs];
              action.payload.forEach(id => {
                const index = newSelectedIDs.indexOf(id);
                if (index !== -1) {
                  newSelectedIDs.splice(index, 1);
                } else {
                  newSelectedIDs.push(id);
                }
              });
              state.selectedIDs = newSelectedIDs;
            }
          },

        resetAll: (state, action)=>{
            state.selectedIDs = []
        },
      
        Update_users: (state, action) => {
            if (action.payload)
                state.users = [...action.payload]
        },
    },
  });



export const LanguagePack = createSlice({

    name: 'LanguagePack',
    
    initialState: {
        
        SelectedLanguage: 1,
        translations: {

            0:  {'globalbutton': 'Toute', 
                'personalbutton': 'Propre', 
                'profilebutton': 'Profil', 
                'themes': ['Nuità', 'Lumi'], 
                'mainpage':"Page d'accueil", 
                'search':'Recherche', 
                'latestitems':'Derniers articles ↓',
                'latestcollections': 'Dernières collections ↓',
                'viewnow': 'Voir maintenant',
                'personal': 'Profil',
                'collections':'Collectionà',
                'items':'Articles',
                'comments':'Commentaires',
                'updatenow' : 'Mettez à jour maintenant',
                'delete':'Supprimer',
                'add':'Ajouter',
                'download CSV':'télécharger CSV',
                'updatedrecently':'Mis à jour récemment',
                'field' : 'Champ',
                'your collections':'Vos collections',
                'cancel':'Annuler',
                'confirm': 'Confirmer',
                'i confirm & delete' : 'Je confirme',
                'title':'Titre',
                'category':'Catégorie',
                'description':'La description',
                'next': 'Suivante',
                'anycustomfield?':'Des champs personnalisés ?',
                'addfield' : 'Ajouter le champ',
                'save': 'Sauvegarder',
                'category': 'Catégorie',
                'books' : 'livres',
                'post-stamps' :'Post-timbres',
                'whiskeys' : 'whiskies',
                'other' : 'autre',
            },

            1 : {'globalbutton': 'All', 
                'personalbutton': ' Personal', 
                'profilebutton': 'Profile', 
                'themes': ['Night', 'Light'], 
                'mainpage':"Main Page", 
                'search':'Search', 
                'latestitems':'Latest Items ↓',
                'latestcollections': 'Latest Collections ↓',
                'viewnow': 'View now',
                'personal': 'Personal',
                'collections':'Collections',
                'items':'Items',
                'comments':'Comments',
                'updatenow' : 'Update now',
                'delete':'Delete',
                'add':'Add',
                'download CSV':'Download CSV',
                'updatedrecently':'Updated Recently',
                'field' : 'Field',
                'your collections':'Your Collections ↓',
                'cancel':'Cancel',
                'confirm': 'Confirm',
                'i confirm & delete' : 'I Confirm & Delete',
                'title':'Title',
                'category':'Category',
                'description':'Description',
                'next': 'Next',
                'anycustomfield?':'Any Custom Field ?',
                'addfield' : 'Add Field',
                'save': 'Save',
                'books' : 'Books',
                'post-stamps' :'Post-Stamps',
                'whiskeys' : 'Whiskies',
                'other' : 'Other',
            },
            
        }
    },
    reducers: {
        Update_Language: (state, action) => {
            state.SelectedLanguage = action.payload
        },
    },
  });


  

const StatesBase = combineReducers({
    ID_sector: IDs.reducer,
    SearchResult: SearchResult.reducer,
    UserSelected: SelectedButton.reducer,
    AdminBase: AdminData.reducer,
    Languages: LanguagePack.reducer,
});

export default StatesBase;