import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  standalone:true,
  imports:[CommonModule]
})
export class LogoComponent implements OnChanges {
  @Input() inputString!: string;
  @Input() size: number = 40;
  @Input() bgColor: string = 'white';
  @Input() color: string = '#035EBC';
  @Input() textColor: string = '#fff';
  initials: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inputString']) {
      this.initials = this.getInitials(this.inputString);
    }
  }

  private getInitials(input: string): string {
    if (!input) {
      return '';
    }

    return input
      .split(' ')
      .map(word => word[0])
      .join('');
  }
}
