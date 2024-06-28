import { Injectable } from '@angular/core';
import { StrapiService } from './strapi.service';


export type Submission = {
  name: string,
  type: string,
  context: string,
  message: string,
  mail: string,
  phone?: string,
}

@Injectable({
  providedIn: 'root'
})
export class SubmissionService extends StrapiService {

  postSubmission(submission: Submission) {
    this.httpClient.post(StrapiService.apiBaseUrl + "submissions", {
      data: submission
    }, { headers: StrapiService.headers }).subscribe(r => console.log(r))
  }
}
