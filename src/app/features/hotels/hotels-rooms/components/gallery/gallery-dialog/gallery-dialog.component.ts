import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { GalleryComponent, GalleryModule, ImageItem } from "ng-gallery";

@Component({
  standalone: true,
  imports: [GalleryModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-gallery-dialog',
  template: `<gallery counterPosition='bottom'></gallery>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryDialogComponent implements AfterViewInit {
    @ViewChild(GalleryComponent) myGallery!: GalleryComponent;

    constructor(@Inject(MAT_DIALOG_DATA) public data: { images: string[] }) {}

    ngAfterViewInit(): void {
        setTimeout(() => {
            if (this.myGallery) {
                this.myGallery.load(this.data.images.map(img => new ImageItem({ src: img })));
            }
        });
    }
}