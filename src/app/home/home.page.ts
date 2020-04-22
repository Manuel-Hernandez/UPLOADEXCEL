import { Component } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import * as XLSX from 'xlsx';

type AOA = any[][];

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {}
   
  public files: NgxFileDropEntry[] = [];

  //upload

 
  public dropped(files: NgxFileDropEntry[]) {
   this.files = files;
    
    for (const droppedFile of files) {
      // ¿Es un archivo?
      if (droppedFile.fileEntry.isFile) {
        
        const droppedFile = files[0];
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

        fileEntry.file((file: File) => {

          const reader = new FileReader();

          fileEntry.file(file => {
              reader.readAsDataURL(file);
              reader.onload = () => {
                  
                  let base64 = reader.result.toString();
                  console.log(base64);
                  base64 = base64.replace("data:application/octet-stream;base64,", "");
                  base64 = base64.replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,","");
                  var decodedString = atob(base64);
                  console.log(decodedString);

                  const bstr: string = decodedString;
                  const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

                  /* grab first sheet */
                  const wsname: string = wb.SheetNames[0];
                  const ws: XLSX.WorkSheet = wb.Sheets[wsname];

                  /* save data */
                  this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
                  console.log(this.data);

              };
          });
       });
      } else {
        console.log("solo se aceptan archivos");
    }
  }
}
 
  public fileOver(event){
   
  }
 
  public fileLeave(event){
   
  }
  

  

//upload
data: AOA = [];



onFileChange(evt: any) {
  /* wire up file reader */
  const target: DataTransfer = <DataTransfer>(evt.target);
  if (target.files.length !== 1) throw new Error('Cannot use multiple files');
  const reader: FileReader = new FileReader();
  reader.onload = (e: any) => {
    /* read workbook */
    const bstr: string = e.target.result;
    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

    /* grab first sheet */
    const wsname: string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

    /* save data */
    this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
    console.log(this.data);
  };
  reader.readAsBinaryString(target.files[0]);
}


urltoFile(url, filename, mimeType){
  return (fetch(url)
      .then(function(res){return res.arrayBuffer();})
      .then(function(buf){return new File([buf], filename,{type:mimeType});})
  );
}

}
