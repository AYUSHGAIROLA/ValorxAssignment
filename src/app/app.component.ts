import { HttpClient } from '@angular/common/http';
import {
  Component,
  Host,
  HostListener,
  Inject,
  OnInit,
  Optional,
  Self,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounce, debounceTime, fromEvent, Observable } from 'rxjs';
import { ContactDataModel, myData } from './constant';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  contactData: Array<ContactDataModel> = [];
  contactsToShow: Array<ContactDataModel> = [];
  listSize: number = 100;
  searchText: string = '';

  constructor(public fb: FormBuilder, public http: HttpClient) {}

  ngOnInit() {
    this.contactData = this.getSortedData(myData);
    this.listenToNameSearchChanges();
  }

  getSortedData(data: Array<ContactDataModel>): Array<ContactDataModel> {
    return data.sort((a: ContactDataModel, b: ContactDataModel) => {
      return a.contact_name > b.contact_name ? 1 : -1;
    });
  }

  listenToNameSearchChanges() {
    this.contactsToShow = this.contactData.slice(0, this.listSize);
    const firstNameSearchElement: Element =
      document.querySelector('.name-search');
    fromEvent(firstNameSearchElement, 'input')
      .pipe(debounceTime(1000))
      .subscribe((event) => {
        this.searchText = event.target['value'];

        this.refreshList();
      });
  }

  @HostListener('window:scroll', ['$event'])
  onListScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      this.increaseListSize();
    }
  }

  increaseListSize() {
    this.listSize += 100;
    this.refreshList();
  }

  refreshList() {
    this.contactsToShow = this.contactData
      .filter((oContact: ContactDataModel) => {
        return oContact.contact_name
          .toUpperCase()
          .includes(this.searchText.toUpperCase());
        //   return (oContact.contact_name
        //     .toUpperCase()
        //     .includes(this.searchText.toUpperCase()) ||
        // // for email
        // oContact.email
        //   .toUpperCase()
        //   .includes(this.searchText.toUpperCase()) ||
        // // phone
        // oContact.phone_number.toUpperCase().includes(this.searchText.toUpperCase()))
      })
      .slice(0, this.listSize);
  }
}
