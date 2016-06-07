module.exports = function(Medication) {
  Medication.observe('access', function logQuery(ctx, next) {
    console.log('Accessing %s matching %s', ctx.Model.modelName, ctx.query.where);
    next();
  });



};
