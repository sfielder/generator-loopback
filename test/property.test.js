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

describe('loopback:property generator', function() {
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

  it('creates number type property from large number', function(done) {
    var propertyGenerator = givenPropertyGenerator();
    helpers.mockPrompt(propertyGenerator, {
      model: 'Car',
      name: 'age',
      type: 'number',
      required: 'true',
      defaultValue: '55555555555555555555.5'
    });

    propertyGenerator.run(function() {
      var definition = common.readJsonSync('common/models/car.json');
      var props = definition.properties || {};
      expect(props).to.have.property('age');
      expect(props.age).to.eql({
        type: 'number',
        required: true,
        default: 55555555555555555555.5
      });
      done();
    });
  });

  it('creates model containing boolean type', function(done) {
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

  it('creates date type property from ISO string', function(done) {
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
        default: '2015-11-01T00:00:00.000Z'
      });
      done();
    });
  });

  it('creates date type property from number', function(done) {
    var propertyGenerator = givenPropertyGenerator();
    helpers.mockPrompt(propertyGenerator, {
      model: 'Car',
      name: 'year',
      type: 'date',
      required: 'true',
      defaultValue: '1466087191000'
    });

    propertyGenerator.run(function() {
      var definition = common.readJsonSync('common/models/car.json');
      var props = definition.properties || {};
      expect(props).to.have.property('year');
      expect(props.year).to.eql({
        type: 'date',
        required: true,
        default: '2016-06-16T14:26:31.000Z'
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
  
  it('creates string item typed array', function(done) {
    var propertyGenerator = givenPropertyGenerator();
    helpers.mockPrompt(propertyGenerator, {
      model: 'Car',
      name: 'options',
      type: 'array',
      itemType: 'string',
      required: 'true',
      defaultValue: 'AWD,3.2L, navigation'
    });

    propertyGenerator.run(function() {
      var definition = common.readJsonSync('common/models/car.json');
      var props = definition.properties || {};
      expect(props).to.have.property('options');
      expect(props.options).to.eql({
        type: 'array',
        itemType: 'string',
        required: true,
        default: ['AWD','3.2L','navigation']
      });
      done();
    });
  });

  it('creates number item typed array', function(done) {
    var propertyGenerator = givenPropertyGenerator();
    helpers.mockPrompt(propertyGenerator, {
      model: 'Car',
      name: 'parts',
      type: 'array',
      itemType: 'number',
      required: 'true',
      defaultValue: '123456, 98765'
    });

    propertyGenerator.run(function() {
      var definition = common.readJsonSync('common/models/car.json');
      var props = definition.properties || {};
      expect(props).to.have.property('parts');
      expect(props.parts).to.eql({
        type: 'array',
        itemType: 'number',
        required: true,
        default: [123456, 98765]
      });
      done();
    });
  });

  it('creates geopoint type property from object', function(done) {
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

  it('creates geopoint type property from numbers', function(done) {
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
      required: true,
      defaultValue: 'Now'
    });

    propertyGenerator.run(function() {
      var definition = common.readJsonSync('common/models/car.json');
      var prop = definition.properties.created;
      expect(prop.defaultFn).to.eql('now');
      done();
    });
  });

  it('creates defaultFn: "guid" on date fields', function(done) {
    var propertyGenerator = givenPropertyGenerator();
    helpers.mockPrompt(propertyGenerator, {
      model: 'Car',
      name: 'uniqueId',
      type: 'string',
      required: true,
      defaultValue: 'uuid'
    });

    propertyGenerator.run(function() {
      var definition = common.readJsonSync('common/models/car.json');
      var prop = definition.properties.uniqueId;
      expect(prop.defaultFn).to.eql('uuid');
      done();
    });
  });

  it('fails to create with unsupported type', function (done) {
    var propertyGenerator = givenPropertyGenerator();
    helpers.mockPrompt(propertyGenerator, {
      model: 'Car',
      name: 'something',
      type: 'unknown',
      required: 'true',
      defaultValue: 'X'
    });

    expect(propertyGenerator.run).to.throw(Error);
    done();
  });

  function givenPropertyGenerator() {
    var name = 'loopback:property';
    var path = '../../property';
    var gen = common.createGenerator(name, path);
    return gen;
  }
});
