import {LightningElement, api, track} from 'lwc';

const SELECT_PREVIOUS = 'select-previous';
const SELECT_NEXT = 'select-next';
const EVENT_TIMEOUT = 200; // ms

const EVENT_SELECT_VALUE = 'selectvalue';

export default class ListViewSlider extends LightningElement {

    selected = {}; // currently selected option
    optionNameByValue = {}; // {'String'=>{Object}} TODO: change to Map
    lastOptionIndex; // Number: the index of the last option in select
    eventDebounce;
    datasets = {
        SELECT_NEXT,
        SELECT_PREVIOUS,
    };

    // DOM elements
    customSelect; // DOM select element

    renderedCallback() {
        this.customSelect = this.template.querySelector('.custom-select');
        if (!this.customSelect) return;

        this.lastOptionIndex = this.customSelect.options.length - 1;
    }

    /********* API ****************************************************************************************************/

    @api set options(values) {
        // check if the value is an array
        if (Array.isArray(values)) {
            const entries = values.map(option => [option.DeveloperName, option]);
            this.optionNameByValue = Object.fromEntries(entries);
        }
    };

    @api set selectedOption(option) {
        // check if the value is an Object
        if (typeof option === 'object' && !Array.isArray(option) && option !== null) {
            this.selected = option;
            this.setDefaultSelectedValue(option);
        }
    };

    get options() {
        return Object.values(this.optionNameByValue);
    }

    get selectedOption() {
        return this.selected;
    }

    /********* Functionality ******************************************************************************************/

    setDefaultSelectedValue(selectedOption = {}) {
        if (!this.customSelect) return;
        this.customSelect.value = selectedOption?.DeveloperName;
    }

    handleChangeSelection(event) {
        const selectedOption = this.getSelectedFromOptionsByName(event.currentTarget.value);
        if (!selectedOption) return;

        this.dispatchEventByOptionName(event.currentTarget.value);
    }

    dispatchEventByOptionName(selectedOptionName = '') {
        clearTimeout(this.eventDebounce);
        const selectedOption = this.getSelectedFromOptionsByName(selectedOptionName);

        if (!selectedOption) return;

        this.selected = selectedOption;

        this.eventDebounce = setTimeout(() => {
            this.dispatchEvent(
                new CustomEvent(EVENT_SELECT_VALUE, {detail: {...selectedOption}}));
        }, EVENT_TIMEOUT);
    }

    getSelectedFromOptionsByName(optionName = '') {
        if (!this.optionNameByValue.hasOwnProperty(optionName)) return;
        return this.optionNameByValue[optionName];
    }

    /********* Buttons Action Handlers ********************************************************************************/

    handleButtonChangeSelection(event) {
        if (!this.customSelect) return;

        const actionType = event.currentTarget.dataset.id;

        switch (actionType) {
            case this.datasets.SELECT_PREVIOUS: {
                this.handleSelectPrevious();
                break;
            }
            case this.datasets.SELECT_NEXT: {
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
        } else {
            this.customSelect.selectedIndex = prevIndex;
        }

        this.dispatchEventByOptionName(this.customSelect.value);
    }

    handleSelectNext() {
        const currentIndex = this.customSelect.selectedIndex;
        const nextIndex = currentIndex + 1;

        if (nextIndex > this.lastOptionIndex) {
            this.customSelect.selectedIndex = 0;
        } else {
            this.customSelect.selectedIndex = nextIndex;
        }

        this.dispatchEventByOptionName(this.customSelect.value);
    }
}