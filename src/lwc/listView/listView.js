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
    //   @api showListView = false;

    showSpinner = true;
    listViewRecords = [];
    searchString = '';
    debounce;

    @api set searchQuery(value) {
        clearTimeout(this.debounce);
        this.debounce = setTimeout(() => {
            this.searchString = value;
        }, SEARCH_DELAY);
    };

    @api setSelectedListView(listView) {
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

        this.showSpinner = false;
    }

    get searchQuery() {
        return this.searchString;
    }

    get isListViewRecordsExist() {
        return !!this.listViewRecords.length;
    }

    handleListViewChange(event) {
        this.showSpinner = true;
        const listView = event.detail;

        this.setSelectedListView(listView);
        this.dispatchEvent(new CustomEvent('listviewchange', {detail: {...listView}}));
    }
}