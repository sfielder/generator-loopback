// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: generator-loopback
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

var path = require('path');
var SG = require('strong-globalize');
var g = SG();

var helpers = require('../lib/helpers');
var yeoman = require('yeoman-generator');

var validateRequiredName = helpers.validateRequiredName;

module.exports = yeoman.Base.extend({
  constructor: function() {
    yeoman.Base.apply(this, arguments);

    this.argument('name', {
      desc: g.f('Name of the boot script to create.'),
      required: false,
      optional: true,
      type: String,
    });
  },

  help: function() {
    return helpers.customHelp(this);
  },

  askForName: function() {
    var done = this.async();

    if (this.name) return done();

    var question = {
      name: 'name',
      message: g.f('Enter the script name (without `.js`):'),
      default: this.name,
      validate: validateRequiredName,
    };

    return this.prompt(question).then(function(answer) {
      this.name = answer.name;
      done();
    }.bind(this));
  },

  askForType: function() {
    var question = {
      name: 'type',
      message: g.f('What type of boot script do you want to generate?'),
      type: 'list',
      choices: [
        {name: g.f('async'), value: 'async'},
        {name: g.f('sync'), value: 'sync'}],
      default: 'async'
    };

    return this.prompt(question).then(function(answer) {
      this.type = answer.type;
    }.bind(this));
  },

  generate: function() {
    var source = this.templatePath(this.type + '.js');

    // yeoman-generator 0.20.x doesn't like the leading /
    var targetPath = path.normalize('server/boot/' + this.name + '.js');
    var target = this.destinationPath(targetPath);

    this.copy(source, target);
  },
});
