import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mandatory-error-message',
  templateUrl: './mandatory-error-message.component.html',
  styleUrls: ['./mandatory-error-message.component.scss']
})
export class MandatoryErrorMessageComponent implements OnInit {

  @Input() listName: string;
  constructor() { }

  ngOnInit() {
  }

}
