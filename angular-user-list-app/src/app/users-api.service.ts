// users-api.service.ts
import { Injectable, inject } from '@angular/core';
import { signalStore, withState, withMethods, withComputed } from '@ngrx/signals';
import { patchState } from '@ngrx/signals';
import { of, delay } from 'rxjs';

export interface UserDto {
  id: string;
  user_name: string;
  is_active: boolean;
}

export interface ListRequest {
  pageNumber: number;
  search?: string;
  itemsPerPage: 5 | 10 | 20;
}

export interface UserListResponseDto {
  total_count: number;
  items: UserDto[];
}

const initialState: {
  users: UserDto[];
  listRequest: ListRequest;
  userListResponse: UserListResponseDto;
} = {
  users: [
    { id: 'u1', user_name: 'Ivan Z.', is_active: true },
    { id: 'u2', user_name: 'Mikhail X.', is_active: true },
    { id: 'u3', user_name: 'Ivan C.', is_active: true },
    { id: 'u4', user_name: 'Petr V.', is_active: true },
    { id: 'u5', user_name: 'Artyom B.', is_active: true },
    { id: 'u6', user_name: 'Gleb N.', is_active: true },
    { id: 'u7', user_name: 'Anton M.', is_active: true },
    { id: 'u8', user_name: 'Semyon A.', is_active: true },
    { id: 'u9', user_name: 'Arseniy S.', is_active: true },
    { id: 'u10', user_name: 'Nick D.', is_active: true },
    { id: 'u11', user_name: 'Alex F.', is_active: true },
    { id: 'u12', user_name: 'Kirill G.', is_active: true },
    { id: 'u13', user_name: 'Stas H.', is_active: true },
    { id: 'u14', user_name: 'Yuriy J.', is_active: true },
    { id: 'u15', user_name: 'Roman K.', is_active: true },
    { id: 'u16', user_name: 'Ivan L.', is_active: true },
    { id: 'u17', user_name: 'Ivan Q.', is_active: true },
  ],
  listRequest: {
    pageNumber: 1,
    itemsPerPage: 10,
  },
  userListResponse: {
    total_count: 0,
    items: [],
  },
};

@Injectable({ providedIn: 'root' })
export const UsersApiStore = signalStore(
  withState(initialState),
  withComputed(({ users, listRequest }) => ({
    filteredUsers: computed(() => {
      let filteredUsers = users();
      const { search } = listRequest();

      if (search) {
        filteredUsers = filteredUsers.filter((user) =>
          user.user_name.toLowerCase().includes(search.toLowerCase())
        );
      }

      return filteredUsers;
    }),
  })),
  withMethods((store) => ({
    getList() {
      const { pageNumber, itemsPerPage } = store.listRequest();
      const filteredUsers = store.filteredUsers();

      const startIndex = (pageNumber - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const items = filteredUsers.slice(startIndex, endIndex);

      const response: UserListResponseDto = {
        total_count: filteredUsers.length,
        items,
      };

      patchState(store, { userListResponse: response });

      return of(response).pipe(delay(500));
    },
    getById(id: string) {
      const user = store.users().find((user) => user.id === id);
      return of(user).pipe(delay(500));
    },
    remove(id: string) {
      patchState(store, (state) => ({
        users: state.users.filter((user) => user.id !== id),
      }));
      return of(undefined).pipe(delay(500));
    },
  }))
);
