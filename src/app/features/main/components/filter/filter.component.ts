import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RemoveUnderscorePipe } from '../../../../pipes/remove-underscore.pipe';

interface FilterItem {
  id: number;
  name: string;
}

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, RemoveUnderscorePipe],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {
  @Input() regions: FilterItem[] = [];
  @Input() productTypes: FilterItem[] = [];
  @Input() selectedTypes: string[] = [];
  @Input() selectedRegions: string[] = [];

  @Output() typeChange = new EventEmitter<string[]>();
  @Output() regionChange = new EventEmitter<string[]>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedTypes']) {
      this.selectedTypes = Array.isArray(this.selectedTypes)
        ? this.selectedTypes
        : [];
    }
    if (changes['selectedRegions']) {
      this.selectedRegions = Array.isArray(this.selectedRegions)
        ? this.selectedRegions
        : [];
    }
  }

  isTypeSelected(typeName: string): boolean {
    return this.selectedTypes.some(
      (type) => type.toLowerCase() === typeName.toLowerCase()
    );
  }

  isRegionSelected(regionName: string): boolean {
    return this.selectedRegions.some(
      (region) => region.toLowerCase() === regionName.toLowerCase()
    );
  }

  onTypeChange(typeName: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    let newSelectedTypes = [...this.selectedTypes];
    if (isChecked) {
      newSelectedTypes.push(typeName);
    } else {
      newSelectedTypes = newSelectedTypes.filter(
        (type) => type.toLowerCase() !== typeName.toLowerCase()
      );
    }
    this.selectedTypes = newSelectedTypes;
    this.typeChange.emit(newSelectedTypes);
  }

  onRegionChange(regionName: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    let newSelectedRegions = [...this.selectedRegions];
    if (isChecked) {
      newSelectedRegions.push(regionName);
    } else {
      newSelectedRegions = newSelectedRegions.filter(
        (region) => region.toLowerCase() !== regionName.toLowerCase()
      );
    }
    this.selectedRegions = newSelectedRegions;
    this.regionChange.emit(newSelectedRegions);
  }
}
