import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from '@angular/router';

import { Page, View, viewMatchesModuleContext, Color } from 'tns-core-modules/ui/page';

import { User } from '../../shared/user/user';
import { UserService } from '../../shared/user/user.service';

@Component({
    selector: "gr-main",
    providers: [
        UserService
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.common.css', './login.css']
})
export class LoginComponent implements OnInit
{
    public user: User;
    public isLoggingIn = true;
    @ViewChild('container', { static: true }) container: ElementRef;

    constructor(
        private router: Router,
        private userService: UserService,
        private page: Page
    )
    {
        this.user = new User();
        this.user.email = 'testlalala@test.com';
        this.user.password = 'test123';
    }

    public ngOnInit(): void
    {
        this.page.actionBarHidden = true;
        this.page.backgroundImage = 'res://bg_login'
    }

    public submit() 
    {
        if (this.isLoggingIn)
        {
            this.login();
        }
        else 
        {
            this.signUp();
        }
    }

    public toggleDisplay() 
    {
        this.isLoggingIn = !this.isLoggingIn;
        const container = <View>this.container.nativeElement;
        container.animate({
            backgroundColor: this.isLoggingIn ? new Color("white") : new Color("#301217"),
            duration: 200
        });
    }

    public login()
    {
        this.userService.login(this.user)
            .subscribe(
                () => this.router.navigate(['/list']),
                (error) => alert('Unfortunately, we could not find your account.')
            )
    }

    public signUp()
    {
        this.userService.register(this.user)
            .subscribe(
                () =>
                {
                    alert('Your account was successfully created.');
                    this.toggleDisplay();
                },
                () => alert('Unfortunately, we were unable to create your account.')
            );
    }
}
