import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import parseJson from 'parse-json';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'json-api-schema';
  jsonPayload = new FormControl();
  apiSchemaJson = new FormControl();
  ngOnInit(): void {
    this.jsonPayload.valueChanges.subscribe(data => {
      // this.jsonPayload.setValue(JSON.stringify(data, undefined, 4), { emitEvent: false});
      const data1 = data
        .split('\n').join('')
        .split(' ').join('')
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ')
        .replace(/: *'([^']+)'/g, ': "$1"')
        .replace(/: *\[([^[\]]+)\]/g, (_: any, values: any) => {
          const doubleQuotedValues = values.replace(/'([^']+?)'/g, '"$1"');
          return `: [${doubleQuotedValues}]`;
        });
      console.log(parseJson(data1));
      let isJson = false;
      try {
        JSON.parse(JSON.stringify(data));
        isJson = true;
      } catch {
        isJson = false
      }
      if (!isJson) {
        return;
      }
      this.setApiSchemaJson(JSON.parse(JSON.stringify(data)));
    });
  }
  setApiSchemaJson(data: any) {
    // const schemaJson = this.convertToStructuredJson(data);
    // console.log(schemaJson);
    // this.apiSchemaJson.setValue(schemaJson);
  }
  getType(value: any) {
    if (typeof value === 'string') {
      return 'string';
    } else if (typeof value === 'number') {
      return 'number';
    } else if (Array.isArray(value)) {
      return 'array';
    } else if (typeof value === 'object') {
      return 'obj';
    } else {
      return 'string';
    }
  }

  convertToStructuredJson(input: any) {
    const structuredJson: any = {};
    Object.keys(input).forEach(key => {
      const value = input[key];

      if (Array.isArray(value)) {
        const arrayType = this.getType(value[0]);
        let dataType = arrayType;

        if (arrayType === 'obj') {
          const data = this.convertToStructuredJson(value[0]);
          structuredJson[key] = {
            type: 'array',
            remark: '',
            dataType: arrayType,
            data
          };
        } else {
          structuredJson[key] = {
            type: 'array',
            remark: '',
            dataType
          };
        }
      } else if (typeof value === 'object') {
        const data = this.convertToStructuredJson(value);
        structuredJson[key] = {
          type: 'obj',
          remark: '',
          data
        };
      } else {
        structuredJson[key] = {
          type: this.getType(value),
          remark: '',
        };
      }
    });
    return structuredJson;
  }
}
