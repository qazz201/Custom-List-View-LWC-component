import {LightningElement, wire, api} from 'lwc';
import getListViewsBySobjectType from '@salesforce/apex/ListViewController.getListViewsBySobjectType';

const CSS_LIST_VIEW_HIDDEN = 'list-view-container__hidden';
const EVENT_MOUSELEAVE = 'mouseleave';

export default class ListViewComponent extends LightningElement {
    @api sObjectType = '';
    @api searchFieldApiName = '';
    @api columns = [];

    searchQuery = '';
    listViewParams = [];

    // DOM
    domMainContainer;

    // DOM triggers
    isEventMouseLeaveAdded = false;

    renderedCallback() {
        this.domMainContainer = this.template.querySelector('.main-container');
        this.addEventMouseLeaveOnElement(this.domMainContainer, this.handleMouseLeaveMainContainer);
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

    handleSearch(event) {
        const isEnterKey = event.keyCode === 13;
        if (isEnterKey) {
            this.searchQuery = event.target.value;
        }
    }

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

    handleMouseMoveMainContainer() {
        if (this.isEventMouseLeaveAdded) return;

        this.addEventMouseLeaveOnElement(this.domMainContainer, this.handleMouseLeaveMainContainer);
    }

    handleListViewChange() {
        this.searchQuery = '';
        this.removeEventMouseLeaveOnElement(this.domMainContainer, this.handleMouseLeaveMainContainer)
        this.handleListViewVisibility(true);
    }

    addEventMouseLeaveOnElement(element, eventHandler) {
        this.isEventMouseLeaveAdded = true;
        element.addEventListener(EVENT_MOUSELEAVE, eventHandler);
    }

    removeEventMouseLeaveOnElement(element, eventHandler) {
        this.isEventMouseLeaveAdded = false;
        element.removeEventListener(EVENT_MOUSELEAVE, eventHandler);
    }
}