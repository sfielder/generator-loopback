// Copyright IBM Corp. 2014,2016. All Rights Reserved.
// Node module: generator-loopback
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-test');
var wsModels = require('loopback-workspace').models;
var SANDBOX =  path.resolve(__dirname, 'sandbox');
var expect = require('chai').expect;
var common = require('./common');

describe.only('loopback:property generator', function() {
  beforeEach(common.resetWorkspace);
  beforeEach(function createSandbox(done) {
    helpers.testDirectory(SANDBOX, done);
  });

  beforeEach(function createProject(done) {
    common.createDummyProject(SANDBOX, 'test-app', done);
  });

  beforeEach(function createCarModel(done) {
    var test = this;
    wsModels.ModelDefinition.create(
      {
        name: 'Car',
        facetName: 'common'
      },
      function(err, model) {
        test.Model = model;
        done(err);
      });
  });

  it('adds an entry to common/models/{name}.json', function(done) {
    var propertyGenerator = givenPropertyGenerator();
    helpers.mockPrompt(propertyGenerator, {
      model: 'Car',
      name: 'isPreferred',
      type: 'boolean',
      required: 'true',
      defaultValue: 'true'
    });

    propertyGenerator.run(function() {
      var definition = common.readJsonSync('common/models/car.json');
      var props = definition.properties || {};
      expect(props).to.have.property('isPreferred');
      expect(props.isPreferred).to.eql({
        type: 'boolean',
        required: true,
        default: true
      });
      done();
    });
  });

  it('should create model containing number type', function(done) {
    var propertyGenerator = givenPropertyGenerator();
    helpers.mockPrompt(propertyGenerator, {
      model: 'Car',
      name: 'age',
      type: 'number',
      required: 'true',
      defaultValue: '555555555555555555555.5'
    });

    propertyGenerator.run(function() {
      var definition = common.readJsonSync('common/models/car.json');
      var props = definition.properties || {};
      expect(props).to.have.property('age');
      expect(props.age).to.eql({
        type: 'number',
        required: true,
        default: 555555555555555555555.5
      });
      done();
    });
  });

  it('should create model containing array type', function(done) {
    var propertyGenerator = givenPropertyGenerator();
    helpers.mockPrompt(propertyGenerator, {
      model: 'Car',
      name: 'options',
      type: 'array',
      required: 'true',
      defaultValue: 'AWD,3.2L, navigation'
    });

    propertyGenerator.run(function() {
      var definition = common.readJsonSync('common/models/car.json');
      var props = definition.properties || {};
      expect(props).to.have.property('options');
      expect(props.options).to.eql({
        type: 'array',
        required: true,
        default: ['AWD','3.2L','navigation']
      });
      done();
    });
  });

  it('should create model containing date type', function(done) {
    var propertyGenerator = givenPropertyGenerator();
    helpers.mockPrompt(propertyGenerator, {
      model: 'Car',
      name: 'year',
      type: 'date',
      required: 'true',
      defaultValue: '2015-11'
    });

    propertyGenerator.run(function() {
      var definition = common.readJsonSync('common/models/car.json');
      var props = definition.properties || {};
      expect(props).to.have.property('year');
      expect(props.year).to.eql({
        type: 'date',
        required: true,
        default: '2015-11'
      });
      done();
    });
  });

  it('should create model containing geopoint type', function(done) {
    var propertyGenerator = givenPropertyGenerator();
    helpers.mockPrompt(propertyGenerator, {
      model: 'Car',
      name: 'location',
      type: 'geopoint',
      required: 'true',
      defaultValue: '{"lat": 55.5, "lng":44.4}'
    });

    propertyGenerator.run(function() {
      var definition = common.readJsonSync('common/models/car.json');
      var props = definition.properties || {};
      expect(props).to.have.property('location');
      expect(props.location).to.eql({
        type: 'geopoint',
        required: true,
        default: {'lat': 55.5, 'lng':44.4}
      });
      done();
    });
  });

  it('should create model containing geopoint type', function(done) {
    var propertyGenerator = givenPropertyGenerator();
    helpers.mockPrompt(propertyGenerator, {
      model: 'Car',
      name: 'location',
      type: 'geopoint',
      required: 'true',
      defaultValue: '55.5, 44.4'
    });

    propertyGenerator.run(function() {
      var definition = common.readJsonSync('common/models/car.json');
      var props = definition.properties || {};
      expect(props).to.have.property('location');
      expect(props.location).to.eql({
        type: 'geopoint',
        required: true,
        default: {'lat': 55.5, 'lng':44.4}
      });
      done();
    });
  });

  it('creates a typed array', function(done) {
    var propertyGenerator = givenPropertyGenerator();
    helpers.mockPrompt(propertyGenerator, {
      model: 'Car',
      name: 'list',
      type: 'array',
      itemType: 'string'
    });

    propertyGenerator.run(function() {
      var definition = common.readJsonSync('common/models/car.json');
      var prop = definition.properties.list;
      expect(prop.type).to.eql(['string']);
      done();
    });
  });

  it('creates a defaultFn: "now" on date fields if specified', function(done) {
    var propertyGenerator = givenPropertyGenerator();
    helpers.mockPrompt(propertyGenerator, {
      model: 'Car',
      name: 'created',
      type: 'date',
      defaultValue: 'Now'
    });

    propertyGenerator.run(function() {
      var definition = common.readJsonSync('common/models/car.json');
      var prop = definition.properties.created;
      expect(prop.defaultFn).to.eql('now');
      done();
    });
  });

  it('creates a defaultFn: "guid" on date fields if specified', function(done) {
    var propertyGenerator = givenPropertyGenerator();
    helpers.mockPrompt(propertyGenerator, {
      model: 'Car',
      name: 'uniqueId',
      type: 'string',
      defaultValue: 'uuid'
    });

    propertyGenerator.run(function() {
      var definition = common.readJsonSync('common/models/car.json');
      var prop = definition.properties.uniqueId;
      expect(prop.defaultFn).to.eql('uuid');
      done();
    });
  });

  function givenPropertyGenerator() {
    var name = 'loopback:property';
    var path = '../../property';
    var gen = common.createGenerator(name, path);
    return gen;
  }
});
