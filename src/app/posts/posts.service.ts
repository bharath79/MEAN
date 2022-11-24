import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/posts/';
@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((data) => {
          return {
            posts: data.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            maxPosts: data.maxPosts,
          };
        })
      )
      .subscribe((data) => {
        this.posts = data.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: data.maxPosts,
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  setPosts(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string; post: Post }>(BACKEND_URL, postData)
      .subscribe((response) => {
        this.router.navigate(['/']);
      });
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let data: Post | FormData;
    if (typeof image === 'object') {
      data = new FormData();
      data.append('id', id);
      data.append('title', title);
      data.append('content', content);
      data.append('image', image);
    } else {
      data = {
        id,
        title,
        content,
        imagePath: image,
        creator: null,
      };
    }
    this.http.put(BACKEND_URL + id, data).subscribe((res) => {
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }
}
