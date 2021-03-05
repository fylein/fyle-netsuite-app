import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
    selector: 'app-paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
    pageNumber: number;
    pageSize: number;
    multiplier: number;
    is3D: boolean;
    @Input() isLoading: boolean;
    @Input() count: number;
    @Input() coloumnArray: any[];
    @Output() getMappings = new EventEmitter<any>();

    constructor(private storageService: StorageService) {}

    getParentMappings() {
        const that = this;
        const data = {
            pageSize: that.multiplier * that.pageSize,
            pageNumber: that.pageNumber,
            is3D: that.is3D
        };
        that.getMappings.emit(data);
    }

    onPageChange(event) {
        const that = this;
        if (that.pageSize !== event.pageSize) {
            that.storageService.set('mappings.pageSize', event.pageSize);
        }
        that.pageSize = event.pageSize;
        that.pageNumber = event.pageIndex;
        that.getParentMappings();
    }


    ngOnInit() {
        const that = this;
        that.pageSize = that.storageService.get('mappings.pageSize') || 10;
        that.pageNumber = 0;
        that.multiplier = that.coloumnArray.includes('ccc') ? 2 : 1;
        that.is3D = that.coloumnArray.includes('ccc');
    }
}
