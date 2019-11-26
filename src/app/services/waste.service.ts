import { Injectable } from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Waste} from '../models/waste';
import {Comment} from '../models/comment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class WasteService {

  constructor(private http: HttpClient,
              ) { }

  getAllWaste(): Observable<Waste[]> {
    console.log('getAllWaste');
    return this.http.get<Waste[]>(`/api/waste`);
  }

  getAllUserWaste(userId: string): Observable<any> {
    return this.http.get<any>(`/api/waste/${userId}`);
  }

  getOneWaste(wastId: string): Observable<Waste> {
    return this.http.get<Waste>(`/api/waste/article/${wastId}`);
  }

  getComment(wasteId: string): Observable<any> {
    return this.http.get<any>(`/api/waste/getComment/all/${wasteId}`);
  }

  sendComment (wasteId: string, waste: Waste): Observable<Comment> {
    console.log('sendComment', wasteId);
    return this.http.post<Comment>(`/api/waste/sendComment/${wasteId}`, waste, httpOptions);
  }

  newWaste(waste: any):  Observable<any> {
    return this.http.post<any>(`/api/waste/new`, waste, httpOptions);
  }

  updateWaste(wasteId: string, wasteParams: Waste) {
    return this.http.put(`/api/waste/${wasteId}`, wasteParams, httpOptions);
  }

  deleteWaste(wasteId: string) {
    return this.http.delete(`/api/waste/${wasteId}`, httpOptions);
  }
}
