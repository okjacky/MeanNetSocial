import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatChipInputEvent, MatDialog} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER, SEMICOLON, SPACE, TAB} from '@angular/cdk/keycodes';
import {User} from '../../../models/user';
import {first, map, startWith} from 'rxjs/operators';
import {DialogMdpOublieComponent} from '../../user/mdp-oublie/mdp-oublie.component';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {UserService} from '../../../services';
import {Observable, Subscription} from 'rxjs';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {MessageService} from '../../../services/message.service';
import {Message} from '../../../models/message';
import {Router} from '@angular/router';

@Component({
  selector: 'app-new-conversation',
  templateUrl: './new-conversation.component.html',
  styleUrls: ['./new-conversation.component.scss']
})
export class NewConversationComponent implements OnInit, OnDestroy {

  userSearchForm: FormGroup;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  userFromSearch: User[] = [];
  filteredUser$: Observable<User[]>;
  listTo: string[] = [];
  listToId: string[] = [];
  subscription: Subscription[] = [];



  @ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('autosize')
  txtAreaAutosize: CdkTextareaAutosize;

  @Input() currentUser$: User;

  constructor(private fb: FormBuilder,
              private router: Router,
              private userService: UserService,
              private messageService: MessageService,
              private el: ElementRef,
              private dialog: MatDialog) {
    this.userSearchForm = this.fb.group({
      textSearch: new FormControl(''),
      participant: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
      userId: new FormControl(''),
    });
    this.userService.getAll()
      .pipe(first()).subscribe((items) => {
        console.log('constructor', items);
        items.forEach(item => this.userFromSearch.push(item));
    });

    this.filteredUser$ = this.userSearchForm.get('textSearch').valueChanges
      .pipe(
        startWith(''),
        map((ami: string ) => ami ? this._filterStates(ami) : this.userFromSearch.slice())
      );
    // console.log('filteredUser$', this.filteredUser$);
  }

  ngOnInit() {this.listToId.push(this.currentUser$._id); }

  ngOnDestroy() {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  private _filterStates(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.userFromSearch.filter(ami => ami.nom.toLowerCase().indexOf(filterValue) === 0);
  }

  remove(ami: any): void {
    const index = this.listTo.indexOf(ami);

    if (index >= 0) {
      this.listTo.splice(index, 1);
    }
    const index2 = this.listTo.indexOf(ami._id);

    if (index2 >= 0) {
      this.listToId.filter(item => item === ami._id);
    }

  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.listTo.push(event.option.viewValue);
    this.listToId.push(event.option.value);
    this.userSearchForm.get('participant').setValue(this.listToId);
    this.nameInput.nativeElement.value = '';
    this.userSearchForm.get('textSearch').setValue(null);
  }

  envoyerMessage () {

    this.userSearchForm.get('userId').setValue(this.currentUser$._id);
    console.log('userSearchForm', this.userSearchForm.value);
    this.subscription.push(this.messageService.newConversation(this.userSearchForm.value)
      .pipe(first()).subscribe((success) => {
        this.router.navigate(['/getConversation', success.conversationId, this.currentUser$.nom]);
      }));
    this.userSearchForm.reset();
    this.listTo = [];
    this.listToId = [];
  }

  scrollToBottom(): void {
    const element: any = this.el.nativeElement.querySelector('.msg-container');
    setTimeout(() => {
      element.scrollTop = element.scrollHeight;
    }, 100);
  }



  /**
  removeMail(email: string): void {
    if (this.listTo.indexOf(email)) {
      const indexTo = this.listTo.indexOf(email);
      if (indexTo > 0) {
        this.listTo.splice(indexTo, 1);
      }
    }

  }

  fileSelected(ami) {
    this.listTo.push(ami.nom);
  }

  addList(ami) {
    this.listTo.push(this.userSearchForm.get('textSearch').value);
    this.userSearchForm.get('textSearch').setValue(null);
  }**/

}
