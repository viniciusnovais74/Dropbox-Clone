class DropBoxController{

    constructor(){

        this.btnSendFileEl = document.querySelector('#btn-send-file');
        this.inputFilesEl =  document.querySelector('#files');
        this.snackModalEl =  document.querySelector('#react-snackbar-root')
        this.progressBarEl = this.snackModalEl.querySelector(".mc-progress-bar-fg");
        this.namefileEl = this.snackModalEl.querySelector(".filename");
        this.timeleftEl = this.snackModalEl.querySelector(".mc-progress-bar-fg");

        this.initEvents();
    }


    initEvents(){

        this.btnSendFileEl.addEventListener('click', event => {
           
            this.inputFilesEl.click();
        
        });
        
        this.inputFilesEl.addEventListener('change', event =>{

            console.log(event.target.files);

            this.uploadTask(event.target.files)
            
            this.snackModalEl.style.display = 'block';
        
        });
    }

    uploadTask(files){

        let promises = [];

        [...files].forEach(file=>{

            promises.push(new Promise((resolve, reject)=>{

                let ajax = new XMLHttpRequest();

                ajax.open('POST', '/upload');

                ajax.onload = event =>{

                    try{
                        resolve(JSON.parse(ajax.responseText));
                    } catch(e){
                        
                        reject(e);

                    }
                };

                ajax.onerror = event=>{
                    reject(event);
                };

                ajax.upload.onprogress = event => {

                    this.uploadProgress();
                    console.log(event);

                }

                let formData = new FormData();

                formData.append('input-file', file);

                this.startUploadTime = Date.now();

                ajax.send(file)

            }));
        });

        return Promise.all(promises);

    }

    uploadProgress(event, file){

        let timespent = Date.now() - this.startUploadTime;
        let loaded = event.loaded;
        let total = event.total;
        let porcent = parseInt((loaded / total)*100);
        let timeleft = ((100 - porcent) * timespent)/porcent;

        this.progressBarEl.style.whith = `${porcent}%`;

        this.namefileEl.innerHTML = file.name;
        this.timeleftEl.innerHTML = '';

        console.log(timespent,timeleft, porcent);
        
    }
}