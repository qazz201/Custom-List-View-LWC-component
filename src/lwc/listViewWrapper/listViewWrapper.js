import {LightningElement, wire, track} from 'lwc';
import getListViewsBySobjectType from '@salesforce/apex/ListViewController.getListViewsBySobjectType';

export default class ListViewWrapper extends LightningElement {
    searchQuery = '';
    listViewParams = [];
    sObjectType = 'Contact';
    // showListView = false;

    // selectedListView = {};
    // selectedListViewId = '';

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

        this.handleListViewVisibility(true);

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

    handleMainContainerMouseLeave() {
        this.searchQuery = '';
        const searchInput = this.template.querySelector('.listView-search-input');

        if (!searchInput) return;

        this.handleListViewVisibility(false);
        searchInput.blur();
    }

    handleListViewVisibility(showListView = false) {
        const listViewContainer = this.template.querySelector('.list-view-container');

        if (!listViewContainer) return;

        if (showListView) {
            listViewContainer.classList.remove('slds-hidden');
            return;
        }

        listViewContainer.classList.add('slds-hidden');
    }

    changeObjectType(event) {
        this.sObjectType = event.target.value;
    }
}