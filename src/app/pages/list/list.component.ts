import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TextField } from 'tns-core-modules/ui/text-field';

import * as SocialShare from 'nativescript-social-share';

import { Grocery } from '~/app/shared/grocery/grocery';
import { GroceryListService } from '~/app/shared/grocery/grocery-list.service';

@Component({
    selector: 'list',
    providers: [GroceryListService],
    templateUrl: 'list.component.html',
    styleUrls: ['list.common.css', 'list.css']
})

export class ListComponent implements OnInit
{
    public groceryList: Grocery[] = [];
    public grocery = '';
    public isLoading = false;
    public listLoaded = false;
    @ViewChild('groceryTextField', { static: true }) groceryTextField: ElementRef;

    constructor(
        private groceryListService: GroceryListService
    ) { }

    public ngOnInit() 
    {
        this.isLoading = true;
        this.groceryListService.load()
            .subscribe(
                groceries =>
                {
                    groceries.forEach(grocery => this.groceryList.unshift(grocery))
                    this.listLoaded = true;
                },
                null,
                () =>
                {
                    this.isLoading = false;
                })
    }

    public add()
    {
        if (this.grocery.trim() === '')
        {
            alert('Enter a grocery item');
            return;
        }

        // Dismiss the keyboard
        let textField = <TextField>this.groceryTextField.nativeElement;
        textField.dismissSoftInput();

        this.groceryListService.add(this.grocery)
            .subscribe(
                groceryObject =>
                {
                    this.groceryList.unshift(groceryObject);
                    this.grocery = '';
                },
                () =>
                {
                    alert({
                        message: 'An error occurred while adding an item to your list.',
                        okButtonText: 'OK'
                    });
                    this.grocery = '';
                }
            );
    }

    public delete(index: number)
    {
        const groceryToDelete = this.groceryList[index];
        this.groceryListService.delete(groceryToDelete)
            .subscribe(
                () =>
                {
                    this.groceryList.splice(index, 1)
                },
                () =>
                {
                    alert({
                        message: 'And error occurred while adding an item to your list.',
                        okButtonText: 'OK'
                    });
                    this.grocery = '';
                }
            );
    }

    public share()
    {
        const list = [];
        for (let i = 0; i < this.groceryList.length; i++)
        {
            list.push(this.groceryList[i].name);
        }
        const listString = list.join(', ').trim();
        SocialShare.shareText(listString);
    }
}
