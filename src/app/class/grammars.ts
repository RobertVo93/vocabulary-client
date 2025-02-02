import { of } from 'rxjs';
import { QuestionBase } from './questions/question-base';
import { TextboxQuestion } from './questions/question-textbox';
import { DropdownQuestion } from './questions/question-dropdown';
import { Config } from '../configuration/config';
import { Option } from '../interface/option';
import { LanguageService } from '../component/data-management/language/language.service';
import { TagsService } from '../component/data-management/tag/tags.service';
import { InlineTextQuestion } from './questions/question-inlineText';
import { CkeditorQuestion } from './questions/question-ckeditor';

export class Grammars {
    private config: Config;
    constructor(obj?){
        this.config = new Config();

        this._id = (obj != null && obj._id != null) ? obj._id : null;
        this.syntax = (obj != null && obj.syntax != null) ? obj.syntax : null;
        this.explain = (obj != null && obj.explain != null) ? obj.explain : null;
        this.example = (obj != null && obj.example != null) ? obj.example : null;
        this.exampleMeaning = (obj != null && obj.exampleMeaning != null) ? obj.exampleMeaning : null;
        this.level = (obj != null && obj.level != null) ? obj.level : null;
        this.language = (obj != null && obj.language != null) ? obj.language : null;
        this.tags = (obj != null && obj.tags != null) ? obj.tags : null;
        this.trainedNumber = (obj != null && obj.trainedNumber != null) ? obj.trainedNumber : 0;

        this.createdBy = (obj != null && obj.createdBy != null) ? obj.createdBy : null;
        this.createdDate = (obj != null && obj.createdDate != null) ? obj.createdDate : null;
        this.modifiedBy = (obj != null && obj.modifiedBy != null) ? obj.modifiedBy : null;
        this.modifiedDate = (obj != null && obj.modifiedDate != null) ? obj.modifiedDate : null;
    }
    _id: any;
    syntax:string;
    explain: string;
    example:string;
    exampleMeaning: string;
    level:string;
    language: string;
    tags: string[];
    trainedNumber: number;
    
    createdBy: string;
    createdDate: Date;
    modifiedBy: string;
    modifiedDate: Date;

    /**
     * each attribute need add to question => load form
     */
    public async getQuestions(langService:LanguageService, tagService:TagsService){
        let questions: QuestionBase<string>[] = [];
        //set up syntax question
        let validators = {};
        validators[this.config.formValidators.require]= {
            value: true,
            error_message: 'Syntax is required.'
        };
        questions.push(new InlineTextQuestion({
            key: 'syntax',
            label: 'Syntax',
            value: this.syntax,
            validators: validators,
            order: 10
        }));
        
        validators = {};
        validators[this.config.formValidators.require]= {
            value: true,
            error_message: 'Explain is required.'
        };
        //set up Explain question
        questions.push(new CkeditorQuestion({
            key: 'explain',
            label: 'Explain',
            value: this.explain,
            validators: validators,
            order: 20
        }));

        //set up example question
        questions.push(new TextboxQuestion({
            key: 'example',
            label: 'Example',
            value: this.example,
            type: this.config.inputTypeDef.text,
            order: 30
        }));

        //set up Example Meaning question
        questions.push(new TextboxQuestion({
            key: 'exampleMeaning',
            label: 'Example Meaning',
            value: this.exampleMeaning,
            type: this.config.inputTypeDef.text,
            order: 40
        }));

        //set up level question
        questions.push(new TextboxQuestion({
            key: 'level',
            label: 'Level',
            value: this.level,
            type: this.config.inputTypeDef.text,
            order: 50
        }));

        //set up language question
        let allLanguage = await langService.getAllData();
        let options:Option[] = [];
        for(var i = 0; i < allLanguage.length; i++){
            options.push({
                value: allLanguage[i]._id,
                viewValue: allLanguage[i].name
            })
        }
        questions.push(new DropdownQuestion({
            key: 'language',
            label: 'Language',
            options: options,
            multiple: false,
            value: this.language,
            order: 60
        }));

        //set up tag question
        validators = {};
        validators[this.config.formValidators.require]= {
            value: true,
            error_message: 'Explain is required.'
        };
        let allTags = await tagService.getAllData();
        options = [];
        for(var i = 0; i < allTags.length; i++){
            options.push({
                value: allTags[i]._id,
                viewValue: allTags[i].name
            });
        }
        questions.push(new DropdownQuestion({
            key: 'tags',
            label: 'Tags',
            options: options,
            multiple: true,
            validators: validators,
            value: this.tags,
            order: 70
        }));

        return of(questions.sort((a, b) => a.order - b.order));
    }
}
