/**
 * Created by vladyslavkravcuk on 18.12.2021.
 */

import {LightningElement} from 'lwc';

export default class LisViewExample extends LightningElement {
    searchFieldApiNameExOne = 'Name';
    sObjectTypeExOne = 'Contact';
    columnsExOne = [
        {label: 'Name', fieldName: 'Name', hideDefaultActions: true},
        {label: 'Email', fieldName: 'Email', hideDefaultActions: true}
    ];

    searchFieldApiNameExTwo = 'Name';
    sObjectTypeExTwo = 'Account';
    columnsExTwo = [
        {label: 'Name', fieldName: 'Name', hideDefaultActions: true},
        {label: 'Phone', fieldName: 'Phone', hideDefaultActions: true}
    ];

    get selectedListViewIndex(){
        return 1;
    }
}