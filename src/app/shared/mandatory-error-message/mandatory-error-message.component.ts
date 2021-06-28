import { Component, OnInit, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'mandatory-error-message',
  templateUrl: './mandatory-error-message.component.html',
  styleUrls: ['./mandatory-error-message.component.scss']
})
export class MandatoryErrorMessageComponent implements OnInit {

  @Input() listName: string;
  @Input() customName: string;
  constructor() { }

  ngOnInit() {
  }

}
