var util = require("util");

function InvalidTypeError(name, templateName){
  Error.call(this, "Union attempted on an Each returned a non-array type.  Name: " + name +", TemplateName:" + templateName);
}

function TemplateNotFoundError(templateName){
  Error.call(this, "Template: " + templateName + " not found");
}

function FailedUnionError(templateName){
  Error.call(this, "Template: " + templateName + " failed to unify");
}

util.inherits(InvalidTypeError, Error);
util.inherits(TemplateNotFoundError, Error);
util.inherits(FailedUnionError, Error)

module.exports.InvalidTypeError = InvalidTypeError;
module.exports.TemplateNotFoundError = TemplateNotFoundError;
module.exports.FailedUnionError = FailedUnionError;
