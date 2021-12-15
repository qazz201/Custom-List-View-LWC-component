import {LightningElement, wire, track} from 'lwc';
import getListViewsBySobjectType from '@salesforce/apex/ListViewController.getListViewsBySobjectType';

export default class ListViewWrapper extends LightningElement {
    searchQuery = '';
    listViewParams = [];
    sObjectType = 'Contact';
    selectedListView = {};
    selectedListViewId = '';

    @wire(getListViewsBySobjectType, {sObjectType: '$sObjectType'})
    loadListViewParams({error, data}) {
        if (data) {
            this.listViewParams = data;
            console.log(data)
        }
        if (error) {
            console.error(error);
        }
    }

    handleInputFocus() {
        const listView = this.template.querySelector('c-list-view');
        if (!listView) return;

        listView.showListView = true;

        if (!listView.selectedListViewId) {
            listView.setDefaultListView(this.listViewParams[0]);
        }
    }

    handleSearch(event) {
        const isEnterKey = event.keyCode === 13;
        if (isEnterKey) {
            this.searchQuery = event.target.value;
        }
    }

    changeObjectType(event) {
        this.sObjectType = event.target.value;
    }
}