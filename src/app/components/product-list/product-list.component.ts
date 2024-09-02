import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  faMap,
  faAngleDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Product } from '../../models/Product.model';

interface ExpandableProduct extends Product {
  expanded: boolean;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  faChevronUp = faChevronUp;
  faAngleDown = faAngleDown;
  faMap = faMap;

  expandableProducts: ExpandableProduct[] = [];

  @Input() set products(value: Product[]) {
    this.expandableProducts = value.map((product) => ({
      ...product,
      expanded: false,
    }));
  }

  toggleProduct(product: Product & { expanded?: boolean }) {
    product.expanded = !product.expanded;
  }
}
