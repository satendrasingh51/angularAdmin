import { Injectable } from '@angular/core';
import * as S3 from 'aws-sdk/clients/s3';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class UploadmediaService {
  constructor(
    private http: HttpClient) { }

  uploadurl = `${environment.uploadurl}`;
  FOLDER: any;
  Bucketname = `${environment.bucketname}`;
  bucket = new S3(
    {
      accessKeyId: 'AKIARFSSKNQYBNJ335WJ',
      secretAccessKey: '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',
      region: 'us-east-2'
    }
  );
  // ---#region setHeaders-------
  private setHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.set('content-type', 'application/json');
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set('ModifiedBy', '1');
    headers = headers.set('languagePreference', '1');

    return headers;
  }
  // ---#endregion setHeaders----------s


  uploadfileonAwsS3(file, fileName?): Observable<any> {

    return new Observable(observer => {
      const params = {
        Bucket: this.Bucketname,
        // Key: file.name,
        Key: !fileName ? ('xyz' + '.' + file.name.split('.')[1]) : fileName,
        Body: file
      };

      this.bucket.upload(params, function (err, data) {
        if (err) {
          observer.next(null);
          // console.log('There was an error uploading your file: ', err);
          // return observer.error('There was an error uploading your file');
        }
        //data.key = data.key.replace('banani/', '');
        console.log('Successfully uploaded file.', data);
        observer.next(data);
      });
    });
  }
  getFiledataFromAws(file, fileName?) {

    return new Observable(observer => {
      const params = {
        Bucket: this.Bucketname,

      };

      this.bucket.listObjects(params, function (err, data) {
        if (err) {
          console.log('There was an error getting your files: ' + err);

        }
        observer.next(data);
        console.log(data, "dattttttttttttttttttt")
        // data.Contents
      });
    })

  }

}

