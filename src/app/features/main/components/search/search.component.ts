import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  @Input() totalProducts: number = 0;

  @Output() allProductsClick = new EventEmitter<void>();
  @Output() searchChange = new EventEmitter<string | null>();

  faMicrophone = faMicrophone;

  searchTerm: FormControl<string | null> = new FormControl('');

  ngOnInit() {
    this.searchTerm.valueChanges.subscribe((val) =>
      this.searchChange.emit(val)
    );
  }

  onAllProductsClick() {
    this.searchTerm.setValue('');
    this.allProductsClick.emit();
  }
}
