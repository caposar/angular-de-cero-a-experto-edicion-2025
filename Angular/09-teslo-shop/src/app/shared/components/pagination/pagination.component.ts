import { Component, computed, input, linkedSignal, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
})
// export class PaginationComponent {
//   pageChange = output<number>();

//   pages = input(0);
//   currentPage = input<number>(1);

//   activePage = linkedSignal(this.currentPage);

//   getPagesList = computed(() => {
//     return Array.from({ length: this.pages() }, (_, i) => i + 1);
//   });

//   goToPage(pageNumber: number): void {
//     this.pageChange.emit(pageNumber);
//   }
// }

export class PaginationComponent {
  pageChange = output<number>();

  pages = input(0);
  currentPage = input<number>(1);

  getPagesList = computed(() => {
    return Array.from({ length: this.pages() }, (_, i) => i + 1);
  });

  goToPage(pageNumber: number): void {
    this.pageChange.emit(pageNumber);
  }
}
