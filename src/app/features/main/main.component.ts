import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { SearchComponent } from './components/search/search.component';
import { FormsModule } from '@angular/forms';
import { FilterComponent } from './components/filter/filter.component';
import { ApiService } from '../../services/api.service';
import { NavComponent } from '../../components/nav/nav.component';
import { Product } from '../../models/Product.model';
import { ModalComponent } from "../../components/modal/modal.component";

interface FilterItem {
  id: number;
  name: string;
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    SearchComponent,
    ProductListComponent,
    NavComponent,
    FilterComponent,
    FormsModule,
    ModalComponent
],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  regions: FilterItem[] = [];
  productTypes: FilterItem[] = [];

  selectedTypes: string[] = [];
  selectedRegions: string[] = [];

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];

  searchTerm: string | null = null;

  isFilterModalOpen = false;
  isSmallScreen = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchRegions();
    this.fetchProductTypes();
    this.fetchProducts();

    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  fetchRegions() {
    this.apiService.getRegions().subscribe(
      (data) => {
        this.regions = data;
      },
      (error) => {
        console.error('Error fetching regions:', error);
        this.handleApiError(error);
      }
    );
  }

  fetchProductTypes() {
    this.apiService.getProductTypes().subscribe(
      (data) => {
        this.productTypes = data;
      },
      (error) => {
        console.error('Error fetching product types:', error);
        this.handleApiError(error);
      }
    );
  }

  fetchProducts() {
    this.apiService.getProducts().subscribe(
      (data) => {
        this.allProducts = data;
        this.filteredProducts = data;
      },
      (error) => {
        console.error('Error fetching products:', error);
        this.handleApiError(error);
      }
    );
  }

  onSearchFilterChange(searchTerm: string | null) {
    this.searchTerm = searchTerm;
    this.applyFilters();
  }

  onTypeChange(selectedTypes: string[]) {
    this.selectedTypes = selectedTypes;
    this.applyFilters();
  }

  onRegionChange(selectedRegions: string[]) {
    this.selectedRegions = selectedRegions;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredProducts = this.allProducts.filter((product) => {
      let searchTermMatch = true;
      if (this.searchTerm) {
        searchTermMatch = product.productName
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());
      }
      const typeMatch =
        this.selectedTypes.length === 0 ||
        this.selectedTypes.some(
          (type) => type.toLowerCase() === product.productType.toLowerCase()
        );

      const regionMatch =
        this.selectedRegions.length === 0 ||
        product.regions.some((region) =>
          this.selectedRegions.some(
            (selectedRegion) =>
              selectedRegion.toLowerCase() === region.toLowerCase()
          )
        );

      return searchTermMatch && typeMatch && regionMatch;
    });
  }

  getTypeId(typeName: string): number {
    const foundType = this.productTypes.find((type) => type.name === typeName);
    return foundType ? foundType.id : -1;
  }

  getRegionId(regionName: string): number {
    const foundRegion = this.regions.find(
      (region) => region.name === regionName
    );
    return foundRegion ? foundRegion.id : -1;
  }

  resetFiltersAndFetchAll() {
    this.searchTerm = null;
    this.selectedTypes = [];
    this.selectedRegions = [];
    this.fetchProducts();
  }

  handleApiError(error: any) {
    if (error.status === 403) {
      // Unauthorized, token might be expired
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth <= 768;
  }

  openFilterModal() {
    this.isFilterModalOpen = true;
  }

  closeFilterModal() {
    this.isFilterModalOpen = false;
  }
}
