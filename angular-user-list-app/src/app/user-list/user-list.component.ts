// user-list.component.ts
import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { UsersApi } from "../users-api.service";
import { ListRequest, UserDto, UserListResponseDto } from "../models";
import { MatIcon } from "@angular/material/icon";
import { MatLine } from "@angular/material/core";
import { FormsModule } from "@angular/forms";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-list',
  templateUrl: 'user-list.component.html',
  styles: [`
    mat-form-field {
      width: 100%;
    }
  `],
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatIcon,
    MatLine,
    FormsModule,
    NgForOf,
    NgIf,
    AsyncPipe
  ]
})
export class UserListComponent implements OnInit {
  users$: Observable<UserDto[]> = new Observable<UserDto[]>();
  totalCount = 0;
  isLoading = false;
  searchTerm = '';
  pageNumber = 1;
  itemsPerPage = 10;

  constructor(private usersApi: UsersApi) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.isLoading = true;

    const request: ListRequest = {
      pageNumber: this.pageNumber,
      search: this.searchTerm,
      itemsPerPage: this.itemsPerPage as 5 | 10 | 20
    };

    this.users$ = this.usersApi.getList(request).pipe(
      map((response: UserListResponseDto) => {
        this.totalCount = response.total_count;
        this.isLoading = false;
        return response.items;
      })
    );
  }

  onSearch() {
    this.pageNumber = 1;
    this.getUsers();
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize as 5 | 10 | 20;
    this.getUsers();
  }

  onDelete(userId: string) {
    this.usersApi.remove(userId).subscribe(() => {
      this.getUsers();
    });
  }
}
