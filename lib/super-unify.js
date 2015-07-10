
var junify = require("junify");

var errors = require("./errors");

function SuperUnify(){
  this.templates = {};
  this.failedUnions = [];
}

SuperUnify.prototype.loadTemplate = function(name, template){
  if(!template){
    throw new Error("Template must be a json object");
  }
  if(typeof(name) !== "string"){
    throw new Error("Name must be a string");
  }

  this.templates[name] = template;

  return this;
};

SuperUnify.prototype.variable = junify.variable;

SuperUnify.prototype._ = junify._;

SuperUnify.prototype.each = function(name, templateName){
  return junify.variable(JSON.stringify({name:name, templateName:templateName, type:"STRONG"}));
}

SuperUnify.prototype.weakEach = function(name, templateName){
  return junify.variable(JSON.stringify({name:name, templateName:templateName, type:"WEAK"}));
}

SuperUnify.prototype.unify = function(data, templateName){
  this.failedUnions = [];

  try{
      return this._unify(data, templateName);
  }catch(err){

    if(err instanceof errors.FailedUnionError){
      return false;
    }
    if(err instanceof errors.TemplateNotFoundError){
      throw err;
    }
    if(err instanceof errors.InvalidTypeError){
      throw err;
    }
  } finally{
    this.failedUnions = this.failedUnions.reverse();
  }
}

SuperUnify.prototype._unify = function(data, templateName){
  this.failedUnions.push(templateName);

  var template = this.templates[templateName];

  if(!template){
    throw new errors.TemplateNotFoundError(templateName);
  }
  var union = junify.unify(data, template);

  if(union === false){
    throw new errors.FailedUnionError(templateName);
  }

  for(var i in union){
    try{
      var parsed = JSON.parse(i);
      if(parsed.name && parsed.templateName && parsed.type){

        if(!(union[i] instanceof Array)){
          throw new errors.InvalidTypeError(parsed.name, parsed.templateName);
        }
        if(parsed.type === "STRONG"){
          this._strongEachUnify(union, parsed, i);
        }
        if(parsed.type === "WEAK"){
          this._weakEachUnify(union, parsed, i);
        }
      }
    }
    catch(err){

        if(err instanceof errors.TemplateNotFoundError){
          throw err;
        }
        if(err instanceof errors.InvalidTypeError){
          throw err;
        }
        if(err instanceof errors.FailedUnionError){
          throw err;
        }

    }
  }

  this.failedUnions.pop();
  return union;

}

SuperUnify.prototype._strongEachUnify = function(union, parsed, eachStr){
  var self = this;
  var failedFilter = false;

  var unionResult = union[eachStr].map(function(val){
    return self._unify(val, parsed.templateName);
  })
  .filter(function(val){
    if(val === false){
      failedFilter = true;
    }
    return val !== false;
  });

  if(failedFilter){
    this.failedUnions.push(parsed.templateName);
    throw new errors.FailedUnionError(parsed.templateName);
  }

  delete union[eachStr];
  if(unionResult.length === 0){
    this.failedUnions.push(parsed.templateName);
    throw new errors.FailedUnionError(parsed.templateName);
  } else {
    union[parsed.name] = unionResult;
  }

}

SuperUnify.prototype._weakEachUnify = function(union, parsed, eachStr){
  var self = this;

  var unionResult = union[eachStr].map(function(val){
    try{
      return self._unify(val, parsed.templateName);
    }
    catch(err){
      if(err instanceof errors.TemplateNotFoundError){
        throw err;
      }
      if(err instanceof errors.InvalidTypeError){
        throw err;
      }
      if(err instanceof errors.FailedUnionError){
        return false;
      }
    }
  })
  .filter(function(val){
    return val !== false;
  });

  delete union[eachStr];

  union[parsed.name] = unionResult;
}

SuperUnify.prototype.chain = function(data){
  return new ChainableUnifier({value:data, failedUnions:[]});
}

var superUnifyInstance = new SuperUnify();

function ChainableUnifier(data){
  this.value = data.value;
  this.failedUnions = data.failedUnions || [];
}

ChainableUnifier.prototype.unify = function(templateName){
  if(this.value === false){
    return new ChainableUnifier(this);
  }

  var union = superUnifyInstance.unify(this.value, templateName);
  var failedUnions = superUnifyInstance.failedUnions

  return new ChainableUnifier({value:union, failedUnions:failedUnions});
}


module.exports = superUnifyInstance;
module.exports.errors = errors;
module.exports.ChainableUnifier = ChainableUnifier;
