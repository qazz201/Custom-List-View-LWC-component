import {LightningElement, api} from 'lwc';

const SELECT_PREVIOUS = 'select-previous';
const SELECT_NEXT = 'select-next';
const SELECT_EVENT = 'selectchange';

export default class ListViewSlider extends LightningElement {
    @api options = [];

    selected = {};
    customSelect; //DOM select element
    lastOptionIndex; // the index of the last option in select

    renderedCallback() {
        this.customSelect = this.template.querySelector('.custom-select');
        if (!this.customSelect) return;

        this.lastOptionIndex = this.customSelect.options.length - 1;
    }

    @api set selectedOption(value) {
        // check if value is an Object
        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
            this.selected = value;
            this.setDefaultSelectedValue(value);
        }
    };

    get selectedOption() {
        return this.selected;
    }

    setDefaultSelectedValue(selectedOption = {}) {
        if (!this.customSelect) return;
        this.customSelect.value = selectedOption.DeveloperName;
    }

    eventDispatcher(detail = {}) {
        dispatchEvent(new CustomEvent(SELECT_EVENT, {detail}));
    }

    handleChangeSelection(event) {
        const value = event.currentTarget.value;
    }

    getSelectedFromOptionsByValue(value='') {

    }

    /********* Buttons Action Handlers ********************************************************************************/

    handleButtonChangeSelection(event) {
        if (!this.customSelect) return;

        const actionType = event.currentTarget.dataset.id;

        switch (actionType) {
            case SELECT_PREVIOUS: {
                this.handleSelectPrevious();
                break;
            }
            case SELECT_NEXT: {
                this.handleSelectNext();
                break;
            }
        }

    }

    handleSelectPrevious() {
        const currentIndex = this.customSelect.selectedIndex;
        const prevIndex = currentIndex - 1;

        if (prevIndex < 0) {
            this.customSelect.selectedIndex = this.lastOptionIndex;
            return;
        }

        this.customSelect.selectedIndex = prevIndex;
        return;
    }

    handleSelectNext() {
        const currentIndex = this.customSelect.selectedIndex;
        const nextIndex = currentIndex + 1;

        if (nextIndex > this.lastOptionIndex) {
            this.customSelect.selectedIndex = 0;
            return;
        }

        this.customSelect.selectedIndex = nextIndex;
        return;
    }
}