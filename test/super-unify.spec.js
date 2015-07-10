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

        it("should return error if template is not an object", function(){
          var fn = function(){
            SuperUnify.loadTemplate("doesnotexist");
          }
          expect(fn).to.throw(Error);
        });

        it("should return error if templateName is not a string", function(){
          var fn = function(){
            SuperUnify.loadTemplate({}, {});
          }
          expect(fn).to.throw(Error);
        });
    });

    describe("functional behaviors", function(){

      beforeEach(function() {
        SuperUnify.loadTemplate("weakBase", weakBaseTemplate);
        SuperUnify.loadTemplate("strongBase", strongBaseTemplate);
        SuperUnify.loadTemplate("simpleBase", simpleVarTemplate);
        SuperUnify.loadTemplate("reach",  reachTemplate);
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

      it("should throw template not found error if templateName is not found", function(){
        var fn = function(){
          SuperUnify.unify({}, "doesnotexist");
        }
        expect(fn).to.throw(SuperUnify.errors.TemplateNotFoundError);

      })

      it("should allow chainables", function(){
        var val = SuperUnify.chain({a:[{b:"Hello"}]})
          .unify("strongBase")
          .unify("reach")
          .value;

        val.should.have.property("C").equals("Hello");
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
        it("should throw InvalidTypeError if strongeach is unified against non-array type", function(){
          var fn = function(){
            SuperUnify.unify({a:"bad data"}, "strongBase");
          }
          expect(fn).to.throw(SuperUnify.errors.InvalidTypeError);

        })
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

var reachTemplate = {
  A: [{B:SuperUnify.variable("C")}]
};
