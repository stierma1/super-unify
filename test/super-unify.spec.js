var sinon = require("sinon");
var chai = require("chai");
var expect = chai.expect;
chai.should();

var SuperUnify = require("../lib/super-unify");

describe("#SuperUnify", function() {

    beforeEach(function() {});
    afterEach(function() {});
    describe("loadTemplate", function() {
        beforeEach(function() {});
        afterEach(function() {});
        it("should load the template", function(){
          var tmpl = {};
          SuperUnify.loadTemplate("base", tmpl);
          SuperUnify.templates.should.have.property("base").equal(tmpl)
        });
    });

    describe("functional behaviors", function(){

      beforeEach(function() {
        SuperUnify.loadTemplate("weakBase", weakBaseTemplate);
        SuperUnify.loadTemplate("strongBase", strongBaseTemplate);
        SuperUnify.loadTemplate("simpleBase", simpleVarTemplate);
      });
      afterEach(function() {});
      it("should allow weak each matching", function(){

        var val = SuperUnify.unify({
          a:[{a:[]}]
        }, "weakBase");

        val.should.have.property("A").length(1);
      });
      it("should allow strong each matching", function(){
        var val = SuperUnify.unify({
          a:[{b:"Hello"}]
        }, "strongBase");

        val.should.have.property("A").length(1);
      });

      it("should have the failed template name if false is returned", function(){
        var val = SuperUnify.unify({
          a:[{z:"Hello"}]
        }, "strongBase");

        expect(val).to.equal(false);
        SuperUnify.failedUnions[0].should.equal("simpleBase");
      });
    });
    describe("each", function() {

    });
    describe("weakEach", function() {
        beforeEach(function() {});
        afterEach(function() {});
    });
    describe("unify", function() {
        beforeEach(function() {});
        afterEach(function() {});
    });
    describe("_unify", function() {
        beforeEach(function() {});
        afterEach(function() {});
    });
    describe("_strongEachUnify", function() {
        beforeEach(function() {});
        afterEach(function() {});
    });
    describe("_weakEachUnify", function() {
        beforeEach(function() {});
        afterEach(function() {});
    });
});

var weakBaseTemplate = {
  a: SuperUnify.weakEach("A", "weakBase")
};

var strongBaseTemplate = {
  a: SuperUnify.each("A", "simpleBase")
};

var simpleVarTemplate = {
  b: SuperUnify.variable("B")
};
