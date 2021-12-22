import {LightningElement, api, wire} from 'lwc';
import getListViewRecords from '@salesforce/apex/ListViewController.getListViewRecords';
//import loadMore from '@salesforce/apex/ListViewController.loadMoreListViewRecords';

import {getListInfoByName} from 'lightning/uiListsApi';
import CONTACT_OBJECT from '@salesforce/schema/Contact';

const SEARCH_DELAY = 200; //ms
const EVENT_LIST_VIEW_CHANGE = 'listviewchange';

export default class ListView extends LightningElement {
    @api listViewParams = [];
    @api sObjectType = '';
    @api selectedListView = {};
    @api selectedListViewId = '';
    @api searchFieldApiName = '';
    @api columns = [];

    showSpinner = true;
    listViewRecords = [];
    searchString = '';
    debounce;

    @api set searchQuery(value) {
        clearTimeout(this.debounce);
        this.showSpinner = true;

        this.debounce = setTimeout(() => {
            this.searchString = value;
        }, SEARCH_DELAY);
    };

    @api setSelectedListView(listView) {
        this.showSpinner = true;
       // this.listViewRecords = [];
        this.selectedListView = listView;
        this.selectedListViewId = this.selectedListView?.Id;
    }

    @wire(getListViewRecords, {
        sObjectType: '$sObjectType',
        listViewId: '$selectedListViewId',
        searchFieldApiName: '$searchFieldApiName',
        searchRequest: '$searchString',
    })
    getRecords({error, data}) {
        if (data) {
            this.listViewRecords = data;
            console.log(this.searchString, data)
        }
        if (error) {
            console.error(error);
        }

        this.showSpinner = false;
    }

    get searchQuery() {
        return this.searchString;
    }

    get isListViewRecordsExist() {
        return Boolean(this.listViewRecords.length);
    }

    handleListViewChange(event) {
        this.showSpinner = true;
        const listView = event.detail;

        this.setSelectedListView(listView);
        this.dispatchEvent(new CustomEvent(EVENT_LIST_VIEW_CHANGE, {detail: {...listView}}));
    }

    loadMoreData(event) {
        console.log('LOAD MORE')
        // loadMore({
        //     sObjectType: this.sObjectType,
        //     listViewId: this.selectedListViewId,
        //     limitRecords: 10,
        //     offsetRecords: 0
        // }).then(result => console.log(result))
    }
}