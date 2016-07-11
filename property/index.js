// Copyright IBM Corp. 2014,2016. All Rights Reserved.
// Node module: generator-loopback
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var actions = require('../lib/actions');
var helpers = require('../lib/helpers');
var validateRequiredName = helpers.validateRequiredName;
var checkPropertyName = helpers.checkPropertyName;
var typeChoices = helpers.getTypeChoices();
var debug = require('debug')('generator:property');

module.exports = yeoman.Base.extend({
  // NOTE(bajtos)
  // This generator does not track file changes via yeoman,
  // as loopback-workspace is editing (modifying) files when
  // saving project changes.

  help: function() {
    return helpers.customHelp(this);
  },

  loadProject: actions.loadProject,

  loadModels: actions.loadModels,

  askForModel: function() {
    if (this.options.modelName) {
      this.modelName = this.options.modelName;
      return;
    }

    var prompts = [
      {
        name: 'model',
        message: 'Select the model:',
        type: 'list',
        choices: this.editableModelNames
      }
    ];

    return this.prompt(prompts).then(function(answers) {
      this.modelName = answers.model;
    }.bind(this));
  },

  findModelDefinition: function() {
    this.modelDefinition = this.projectModels.filter(function(m) {
      return m.name === this.modelName;
    }.bind(this))[0];

    if (!this.modelDefinition) {
      var msg = 'Model not found: ' + this.modelName;
      this.log(chalk.red(msg));
      this.async()(new Error(msg));
    }
  },

  askForParameters: function() {
    this.name = this.options.propertyName;

    var prompts = [
      {
        name: 'name',
        message: 'Enter the property name:',
        validate: checkPropertyName,
        when: function() {
          return !this.name && this.name !== 0;
        }.bind(this)
      },
      {
        name: 'type',
        message: 'Property type:',
        type: 'list',
        choices: typeChoices
      },
      {
        name: 'customType',
        message: 'Enter the type:',
        required: true,
        validate: validateRequiredName,
        when: function(answers) {
          return answers.type === null;
        }
      },
      {
        name: 'itemType',
        message: 'The type of array items:',
        type: 'list',
        choices: typeChoices.filter(function(t) { return t !== 'array'; }),
        when: function(answers) {
          return answers.type === 'array';
        }
      },
      {
        name: 'customItemType',
        message: 'Enter the item type:',
        validate: validateRequiredName,
        when: function(answers) {
          return answers.type === 'array' && answers.itemType === null;
        }
      },
      {
        name: 'required',
        message: 'Required?',
        type: 'confirm',
        default: false
      },
      {
         name: 'defaultValue',
         message: 'Default value[leave blank for none]:',
         default: null
      }
    ];
    return this.prompt(prompts).then(function(answers) {
      this.name = answers.name || this.name;
      if (answers.type === 'array') {
        var itemType =  answers.customItemType || answers.itemType;
        this.type = itemType ? [itemType] : 'array';
      } else {
        this.type = answers.customType || answers.type;
      }
      this.required = answers.required;
      this.defaultValue = answers.defaultValue;
    }.bind(this));
  },

  property: function() {
    var done = this.async();
    var def = {
      name: this.name,
      type: this.type
    };
    if (this.required) {
      def.required = true;
    }

    if (this.defaultValue) {
      def = coerceDefault(def, this.defaultValue);
    }
    debug(this.modelName+ ' property: %j', def);

    this.modelDefinition.properties.create(def, function(err) {
      helpers.reportValidationError(err, this.log);
      return done(err);
    }.bind(this));
  },

  saveProject: actions.saveProject
});

function coerceDefault(def, value) {
  var isSupported = typeChoices.indexOf(def.type) !== -1;
  debug('property type "%s" >> supported: %s', def.type, isSupported);

  if (typeof value === 'string' && isSupported) {
    switch ((def.type || '').toLowerCase()) {
      case 'string':
        if (value === 'uuid' || value === 'guid'){
          def.defaultFn = value;
        } else {
          def.default = value;
        }
        break;
      case 'number':
        def.default = Number(value);
        break;
      case 'boolean':
        if (['true', '1', 't'].indexOf(value) !== -1 ){
          def.default = true;
        } else {
          def.default = false;
        }
        break;
      case 'object':
        def.default = JSON.parse(value);
        break;
      case 'array':
        def.default = value.replace(/[\s,]+/g, ',').split(',');
        break;
      case 'date':
        console.warn('Warning: property default value was converted' +
          ' from string using ISO formatting');
        if (value.toLowerCase() === 'now'){
          def.defaultFn = 'now';
        } else {
          def.default = new Date(value);
        }
        break;
      case 'geopoint':
        if (value.indexOf('lat') !== -1 && value.indexOf('lng') !== -1) {
          def.default = JSON.parse(value);
        } else {
          var geo = value.replace(/[\s,]+/g, ',').split(',');
          def.default = {};
          def.default.lat = Number(geo[0]);
          def.default.lng = Number(geo[1]);
        }
        break;
      case 'buffer':
        console.warn('Warning: property default value was converted' + 
          'from string using UTF8 encoding');
        def.default = new Buffer(value);
        break;
      case 'any':
        console.warn('Warning: property default value was stored as string');
        def.default = value;
        break;
      default:
    }
    return def;
  } else {
    throw Error('Unsupported model property type: ' + def.type);
  }
}
