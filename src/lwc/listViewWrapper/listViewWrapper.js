import {LightningElement, wire, track} from 'lwc';
import getListViewsBySobjectType from '@salesforce/apex/ListViewController.getListViewsBySobjectType';

const CSS_LIST_VIEW_HIDDEN = 'list-view-container__hidden';

const EVENT_MOUSELEAVE = 'mouseleave';

export default class ListViewWrapper extends LightningElement {
    searchQuery = '';
    listViewParams = [];
    sObjectType = 'Contact';

    // DOM
    domMainContainer;

    // DOM triggers
    isEventMouseLeaveAdded = false;

    renderedCallback() {
        this.isEventMouseLeaveAdded = true;
        this.domMainContainer = this.template.querySelector('.main-container');
        this.addEventListenerOnElement(this.domMainContainer, EVENT_MOUSELEAVE, this.handleMouseLeaveMainContainer);
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

    /********* List View Visibility Handlers **************************************************************************/

    handleListViewVisibility(showListView = false) {
        const listViewContainer = this.template.querySelector('.list-view-container');

        if (!listViewContainer) return;

        if (showListView) {
            listViewContainer.classList.remove(CSS_LIST_VIEW_HIDDEN);
            return;
        }

        listViewContainer.classList.add(CSS_LIST_VIEW_HIDDEN);
    }

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

    handleMouseMoveMainContainer() {
        if (this.isEventMouseLeaveAdded) return;

        this.isEventMouseLeaveAdded = true;
        this.addEventListenerOnElement(this.domMainContainer, EVENT_MOUSELEAVE, this.handleMouseLeaveMainContainer);
    }

    handleListViewChange(event) {
        this.isEventMouseLeaveAdded = false;
        this.removeEventListenerOnElement(this.domMainContainer, EVENT_MOUSELEAVE, this.handleMouseLeaveMainContainer);
        this.handleListViewVisibility(true);
    }

    addEventListenerOnElement(element, eventName, eventHandler) {
        element.addEventListener(eventName, eventHandler);
    }

    removeEventListenerOnElement(element, eventName, eventHandler) {
        element.removeEventListener(eventName, eventHandler);
    }
}