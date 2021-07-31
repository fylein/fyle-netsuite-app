import { Component, OnInit, Input } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mandatory-error-message',
  templateUrl: './mandatory-error-message.component.html',
  styleUrls: ['./mandatory-error-message.component.scss']
})
export class MandatoryErrorMessageComponent implements OnInit {

  @Input() listName: string;
  @Input() inputName: string;
  @Input() customErrorMessage: string;
  constructor() { }

  ngOnInit() {
    const that = this;
    if (that.listName) {
      const vowels = ['a', 'e', 'i', 'o', 'u'];

      if (vowels.indexOf(that.listName[0].toLowerCase()) === -1) {
        that.listName = `a ${that.listName}`;
      } else {
        that.listName = `an ${that.listName}`;
      }
    }
  }

}
