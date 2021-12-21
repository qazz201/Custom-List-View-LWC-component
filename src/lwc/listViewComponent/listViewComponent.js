import {LightningElement, wire, api} from 'lwc';
import getListViewsBySobjectType from '@salesforce/apex/ListViewController.getListViewsBySobjectType';

const CSS_LIST_VIEW_HIDDEN = 'list-view-container__hidden';
const EVENT_MOUSELEAVE = 'mouseleave';

export default class ListViewComponent extends LightningElement {
    @api sObjectType = '';
    @api searchFieldApiName = '';
    @api selectedListViewIndex = 0;
    @api columns = [];

    searchQuery = '';
    listViewParams = [];
    wiredSObjectType = ''; // to delay @wire service
    searchDelay = 250; //ms
    searchDebounce;

    // DOM
    domMainContainer;
    domListView;
    domListViewContainer;
    domSearchInput;

    // DOM triggers
    isEventMouseLeaveAdded = false;

    renderedCallback() {
        this.domListView = this.template.querySelector('c-list-view');
        this.domMainContainer = this.template.querySelector('.main-container');
        this.domListViewContainer = this.template.querySelector('.list-view-container');
        this.domSearchInput = this.template.querySelector('.listView-search-input');

        this.addEventMouseLeaveOnElement(this.domMainContainer, this.handleMouseLeaveMainContainer);
    }

    @wire(getListViewsBySobjectType, {sObjectType: '$wiredSObjectType'})
    loadListViewParams({error, data}) {
        if (data) {
            this.listViewParams = data;
            this.setSelectedListView();
            console.log(data)
        }

        if (error) {
            console.error(error);
        }
    }

    handleSearch(event) {
        clearTimeout(this.searchDebounce);
        const searchQuery = event.currentTarget.value;

        this.searchDebounce = setTimeout(() => this.searchQuery = searchQuery, this.searchDelay);
    }

    /********* List View Visibility Handlers **************************************************************************/

    handleInputFocus() {
        this.wiredSObjectType = this.sObjectType; // run @wire service
        this.setSelectedListView();
        this.handleListViewVisibility(true);
    }

    setSelectedListView() {
        if (!this.domListView) return;

        if (!this.domListView.selectedListViewId) {
            this.domListView.setSelectedListView(this.listViewParams[this.selectedListViewIndex]);
        }
    }

    handleListViewVisibility(showListView = false) {
        if (!this.domListViewContainer) return;

        if (showListView) {
            this.domListViewContainer.classList.remove(CSS_LIST_VIEW_HIDDEN);
            return;
        }

        this.domListViewContainer.classList.add(CSS_LIST_VIEW_HIDDEN);
    }

    handleMouseLeaveMainContainer = () => {
        this.searchQuery = '';
        this.handleListViewVisibility(false);

        if (!this.domSearchInput) return;
        this.domSearchInput.blur();
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