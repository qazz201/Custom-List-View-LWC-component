/**
 * Created by vladyslavkravcuk on 18.12.2021.
 */

import {LightningElement} from 'lwc';

export default class LisViewExample extends LightningElement {
    searchFieldApiName = 'Name';
    sObjectType = 'Contact';
    columns = [
        {label: 'Name', fieldName: 'Name', hideDefaultActions: true},
        {label: 'Email', fieldName: 'Email', hideDefaultActions: true}
    ];

    changeObjectType(event) {
        this.sObjectType = event.target.value;
    }
}