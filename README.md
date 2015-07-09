# super-unify
Recursively unify and pattern match against a json object.
Based on junify.

## install
```
npm install super-unify
```

##usage
```
var SuperUnify = require("super-unify");

var myTemplate = {
  a : SuperUnify.variable("myVar")
}

SuperUnify.loadTemplate("base", myTemplate);

var val = SuperUnify.unify({a: "hello"}, "base");
// val equals {"myVar" : "hello"}

var val2 = SuperUnify.unify({b: "world"}, "base");
// val equals false
// SuperUnify.failedUnions equals ["base"]

```

##API

### SuperUnify.failedUnions
An array containing the names of the templates that failed to unify in the last unify
execution.  It is ordered from last invoked template to first invoked template.  ie deepest to shallowest.

### SuperUnify.variable(name) -> Unifyable Variable
see junify's variable

### SuperUnify._ ->  Unifyable Wildcard
see junify's _

### SuperUnify.each(name, templateName) -> Unifyiable Variable
Each will return a unifying variable that when unified against an Array  
will run SuperUnify.unify() against each element with the specified template  

If a single element fails to unify then the whole unification will return false  

```
var SuperUnify = require("super-unify");

var myTemplate = {
  b : SuperUnify.variable("myVar")
}

var myEach = {
  a : SuperUnify.each("EachMatch", "simpleVar")
}

SuperUnify.loadTemplate("simpleVar", myTemplate);
SuperUnify.loadTemplate("each", myEach);

var val = SuperUnify.unify({a:[{b: "Hello"}, {b:"World"}]}, "each");
// val equals {"EachMatch" : [{myVar:"Hello"}, {myVar:"World"}]}

var val2 = SuperUnify.unify({a: [{b: "world"}, {c:"fail"}], "each");
// val equals false
// SuperUnify.failedUnions equals ["simpleVar", "each"]

```

### SuperUnify.weakEach(name, templateName) -> Unifyiable Variable
Each will return a unifying variable that when unified against an Array
will run SuperUnify.unify() against each element with the specified template

If an element fails to unify it will be removed from the union array  
If nothing unifies then it will return an empty array

```
var SuperUnify = require("super-unify");

var myTemplate = {
  b : SuperUnify.variable("myVar")
}

var myEach = {
  a : SuperUnify.weakEach("EachMatch", "simpleVar")
}

SuperUnify.loadTemplate("simpleVar", myTemplate);
SuperUnify.loadTemplate("weakEach", myEach);

var val = SuperUnify.unify({a:[{b: "Hello"}, {b:"World"}]}, "weakEach");
// val equals {"EachMatch" : [{myVar:"Hello"}, {myVar:"World"}]}

var val2 = SuperUnify.unify({a: [{b: "world"}, {c:"fail"}], "weakEach");
// val equals {"EachMatch" : [{myVar:"world"}]}

```
