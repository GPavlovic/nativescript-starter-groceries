import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from '@angular/router';

import { Page, View, Color } from 'tns-core-modules/ui/page';
import { TextField } from 'tns-core-modules/ui/text-field';

import { User } from '../../shared/user/user';
import { UserService } from '../../shared/user/user.service';
import { setHintColor } from '~/app/utils/hint-util';

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
    @ViewChild('email', { static: true }) emailTextField: ElementRef;
    @ViewChild('password', { static: true }) passwordTextField: ElementRef;

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
        if (!this.user.isValidEmail())
        {
            alert('Enter a valid email address.');
            return;
        }

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
        this.setTextFieldColours();
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

    private signUp()
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

    private setTextFieldColours()
    {
        const emailTextField = <TextField>this.emailTextField.nativeElement;
        const passwordTextField = <TextField>this.passwordTextField.nativeElement;

        const mainTextColor = new Color(this.isLoggingIn ? 'black' : '#C4AFB4');
        emailTextField.color = mainTextColor;
        passwordTextField.color = mainTextColor;

        const hintColor = new Color(this.isLoggingIn ? '#ACA6A7' : '#C4AFB4');
        setHintColor({ view: emailTextField, color: hintColor });
        setHintColor({ view: passwordTextField, color: hintColor });
    }
}
