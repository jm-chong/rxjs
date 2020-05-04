import './basic.css';

import { from, fromEvent, Subject, Observable } from 'rxjs';
import {
  map,
  debounceTime,
  retry,
  finalize,
  switchMap,
  filter,
  tap,
  distinctUntilChanged,
  partition
} from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

type User = {
  avatar_url: string;
  html_url: string;
  login: string;
};

const url = query => `https://api.github.com/search/users?q=${query}`;
const searchInput = document.getElementById('search');
const $layer = document.getElementById('suggestLayer');

const keyup$ = fromEvent(searchInput as HTMLInputElement, 'keyup').pipe(
  debounceTime(300),
  map((event: KeyboardEvent) => (event.target as HTMLInputElement).value),
  distinctUntilChanged()
);

// const user$ = keyup$.pipe(
//   filter(query => query.trim().length > 0),
//   tap(showLoading),
//   flatMap(query => ajax.getJSON(url(query))),
//   tap(hideLoading)
// );

// const reset$ = keyup$.pipe(filter(query => query.trim().length === 0));
const subject = new Subject();

let [user$, reset$] = subject.pipe(
  // @ts-ignore
  partition<string>(query => query.trim().length > 0)
);

keyup$.subscribe(subject);

user$ = user$.pipe(
  filter(query => query.trim().length > 0),
  tap(showLoading),
  switchMap(query => ajax.getJSON<string>(url(query))),
  tap(hideLoading),
  retry(2),
  finalize(hideLoading)
);

user$.subscribe((v: any) => {
  drawLayer(v.items);
});

reset$.subscribe((v: any) => {
  $layer.innerHTML = '';
});

function drawLayer(items: User[]) {
  $layer.innerHTML = items
    .map(
      user => `<li class="user">
    <img src="${user.avatar_url}" width="50px" height="50px" />
    <p><a href="${user.html_url}" target="_blank">${user.login}</a></p>
    </li>`
    )
    .join('');
}

const $loading = document.getElementById('loading');

function showLoading() {
  $loading.style.display = 'block';
}

function hideLoading() {
  $loading.style.display = 'none';
}
