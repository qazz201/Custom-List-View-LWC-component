import {LightningElement, wire, track} from 'lwc';
import getListViewsBySobjectType from '@salesforce/apex/ListViewController.getListViewsBySobjectType';

const CSS_LIST_VIEW_HIDDEN = 'list-view-container__hidden';

export default class ListViewWrapper extends LightningElement {
    searchQuery = '';
    listViewParams = [];
    sObjectType = 'Contact';
    mouseOverMainContainer = false;
    // showListView = false;

    // selectedListView = {};
    // selectedListViewId = '';

    renderedCallback() {
        this.template.querySelector('.main-container')
            .addEventListener('mouseleave', this.handleMouseLeaveMainContainer);
    }

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

    changeObjectType(event) {
        this.sObjectType = event.target.value;
    }

    handleSearch(event) {
        const isEnterKey = event.keyCode === 13;
        if (isEnterKey) {
            this.searchQuery = event.target.value;
        }
    }

    // handleMouseOver() {
    //     this.mouseOverMainContainer = true;
    //     console.log('_____MOUSE OVER_____')
    // }

    //
    // handleMouseOut() {
    //     console.log('_____MOUSE Out_____')
    // }
    //
    // handleBlurMainContainer() {
    //     console.log('_____BLURRRRR_____')
    //     if (!this.mouseOverMainContainer) this.handleMouseLeaveMainContainer();
    //
    // }

    /********* List View Visibility Handlers **************************************************************************/

    handleInputFocus() {
        const listView = this.template.querySelector('c-list-view');
        if (!listView) return;

        this.handleListViewVisibility(true);

        if (!listView.selectedListViewId) {
            listView.setSelectedListView(this.listViewParams[0]);
        }
    }

    handleMouseLeaveMainContainer = () => {
        this.searchQuery = '';
        this.handleListViewVisibility(false);

        const searchInput = this.template.querySelector('.listView-search-input');
        if (!searchInput) return;
        searchInput.blur();
    }

    handleListViewVisibility(showListView = false) {
        const listViewContainer = this.template.querySelector('.list-view-container');

        if (!listViewContainer) return;

        if (showListView) {
            listViewContainer.classList.remove(CSS_LIST_VIEW_HIDDEN);
            return;
        }

        listViewContainer.classList.add(CSS_LIST_VIEW_HIDDEN);
    }

    handleMouseMove() {
        console.log("ENTERRRRRR")
        this.template.querySelector('.main-container')
            .addEventListener('mouseleave', this.handleMouseLeaveMainContainer);
    }

    handleListViewChange(event) {
        this.template.querySelector('.main-container')
            .removeEventListener('mouseleave', this.handleMouseLeaveMainContainer);

        console.log('Asdsdsd')
        setTimeout(() => {
            this.handleInputFocus();
        }, 200);
    }
}