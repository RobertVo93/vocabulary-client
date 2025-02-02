import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { QuestionBase } from '../../../../class/questions/question-base';
import { ImagesService } from 'src/app/component/data-management/images/images.service';
import { ResponseData } from 'src/app/class/common/responseData';
import * as Editor from 'ckeditor/ckeditor';
import { Config } from 'src/app/configuration/config';
import { MatDialog } from '@angular/material';
import { AlertService } from 'src/app/services/alert.service';
import { UploadAdapterService } from 'src/app/services/upload-adapter-service';

@Component({
	selector: 'app-question',
	templateUrl: './dynamic-form-question.component.html',
	styleUrls: ['./dynamic-form-question.component.css']
})
export class DynamicFormQuestionComponent implements OnInit{
	public Editor = Editor;
	previewSelectedImage;
	images;
	@Input() question: QuestionBase<string>;
	@Input() form: FormGroup;
	@Input() errorMessages;

	constructor(private config: Config, private dialog: MatDialog,
		private imgService: ImagesService, private domSanitizer: DomSanitizer, private alertService: AlertService) {}

	ngOnInit(){
		if(this.question.controlType == "file" && this.question.value){
			//bind preview image when it has value
			this.previewSelectedImage = `${this.config.apiServiceURL.images}/${this.question.value}`;
			this.question.readonly = true;
		}
		if(this.question.controlType == "dropdown"){
			//in case of question.value == 0 then the dropdown list did not work well
			this.form.get(this.question.key).setValue(this.question.value);
		}
	}
	get isValid() { return this.form.controls[this.question.key].valid; }

	/**
	 * Handle on ready for ckeditor
	 * @param editor CKeditor
	 */
	public onReady( editor ) {
		//add plugin add file
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
			return new UploadAdapterService(loader, new Config());
		};
	}
	
	/**
	 * handle image change
	 * @param event event
	 */
	onSelectImage(event) {
		if (event.target.files.length > 0) {
			const file = event.target.files[0];
			this.images = file;
			//preview image
			this.previewSelectedImage = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
			this.question.readonly = false;
		}
	}

	/**
	* 
	* @param el 
	* @param text 
	*/
	onUpdate(text) {
		if (text == null) { return; }
		// copy and mutate
		this.question.value = text;
	}

	/**
	 * Submit image
	 */
	onSubmitImage() {
		var scope = this;
		const formData = new FormData();
		formData.append('files', this.images);

		this.imgService.createData(formData).subscribe(
			(res) => {
				var response = new ResponseData(res);
				if (response.success) {
					scope.question.value = response.returnObj;
					scope.question.readonly = true;
					this.alertService.success(this.config.commonMessage.createSuccessfull);
				}
				else {
					this.alertService.error(this.config.commonMessage.createError);
				}

			},
			(err) => {
				this.alertService.error(this.config.commonMessage.createError);
			}
		);
	}
}