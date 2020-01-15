import { Component } from '@angular/core';
import { Set } from '@nx-apollo-example/api-interfaces';
import { Observable } from 'rxjs';
import { SetListGQL } from '../generated/generated';
import { map } from 'rxjs/operators';

@Component({
  selector: 'nx-apollo-example-set-list',
  templateUrl: './set-list.component.html',
  styleUrls: ['./set-list.component.css']
})
export class SetListComponent {
  sets$: Observable<Set[]>;

  constructor(private setListGQL: SetListGQL) {
    this.sets$ = this.setListGQL.watch().valueChanges.pipe(map((result) => result.data.allSets));
  }
}
