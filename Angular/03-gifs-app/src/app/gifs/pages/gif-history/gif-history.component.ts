import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { GifService } from '../../services/gif.service';
import { GifListComponent } from "../../components/gif-list/gif-list.component";

@Component({
  selector: 'app-gif-history',
  imports: [GifListComponent],
  templateUrl: './gif-history.component.html',
})
export class GifHistoryComponent {

  private route = inject(ActivatedRoute);
  gifService = inject(GifService);

  // query = inject(ActivatedRoute).params.subscribe((params) => {
  //   console.log(params['query']);
  // });

  query = toSignal(
    this.route.params.pipe(map(params => params['query']))
  );

  gifsByKey = computed(() => this.gifService.getHistroyGifs(this.query()));

}
