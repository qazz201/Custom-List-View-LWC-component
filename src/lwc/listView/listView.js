import {LightningElement, api, wire} from 'lwc';
import getListViewRecords from '@salesforce/apex/ListViewController.getListViewRecords';


import {getListInfoByName} from 'lightning/uiListsApi';
import CONTACT_OBJECT from '@salesforce/schema/Contact';

const SEARCH_DELAY = 200; //ms

export default class ListView extends LightningElement {
    @api listViewParams = [];
    @api sObjectType = '';
    @api selectedListView = {};
    @api selectedListViewId = '';
    @api showListView = false;

    listViewRecords = [];
    searchString = '';
    debounce;

    @api set searchQuery(value) {
        clearTimeout(this.debounce);
        this.debounce = setTimeout(() => {
            this.searchString = value;
            console.log(this.searchString,"AAAA SEARCHHH")
        }, SEARCH_DELAY);
    };

    @api setDefaultListView(listView) {
        this.selectedListView = listView;
        this.selectedListViewId = this.selectedListView?.Id;
    }

    @wire(getListViewRecords, {
        sObjectType: '$sObjectType',
        listViewId: '$selectedListViewId',
        searchRequest: '$searchQuery',
    })
    getListViewRecords({error, data}) {
        if (data) {
            this.listViewRecords = data;
            console.log(data)
        }
        if (error) {
            console.error(error);
        }
    }

    get searchQuery() {
        return this.searchString;
    }

    get isListViewRecordsExist(){
        console.log(!!this.listViewRecords.length)
        return !!this.listViewRecords.length;
    }

    handleListViewChange(event) {
        const selectedListViewApiName = event.detail.value;
        const listView = this.listViewParams.find(listView => listView.DeveloperName === selectedListViewApiName);

        this.setDefaultListView(listView);
    }
}