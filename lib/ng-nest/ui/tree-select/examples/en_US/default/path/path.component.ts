import { Component } from '@angular/core';
import { XTreeSelectNode } from '@ng-nest/ui/tree-select';

@Component({
  selector: 'ex-path',
  templateUrl: './path.component.html',
  styleUrls: ['./path.component.scss']
})
export class ExPathComponent {
  data1: XTreeSelectNode[] = [
    { id: 1, label: 'Fruit' },
    { id: 2, label: 'Vegetable' },
    { id: 3, label: 'Drink' },
    { id: 4, label: 'Apple', pid: 1 },
    { id: 5, label: 'Banana', pid: 1 },
    { id: 6, label: 'Pear', pid: 1 },
    { id: 7, label: 'Lettuce', pid: 2 },
    { id: 8, label: 'Cabbage', pid: 2 },
    { id: 9, label: 'Leek', pid: 2 },
    { id: 10, label: 'Soda', pid: 3 },
    { id: 11, label: 'Juice', pid: 3 },
    { id: 12, label: 'Purified water', pid: 3 },
    { id: 13, label: 'Millet banana', pid: 5 },
    { id: 14, label: 'Canna edulis', pid: 5 },
    { id: 15, label: 'Emperor banana', pid: 5 }
  ];
  data2: XTreeSelectNode[] = JSON.parse(JSON.stringify(this.data1));
  data3: XTreeSelectNode[] = JSON.parse(JSON.stringify(this.data1));

  model1: any;
  model2 = 14;
  model3 = 14;

  change(value: number) {
    console.log(value);
  }
}