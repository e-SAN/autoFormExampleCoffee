@FieldValueIs = new Meteor.Collection "FieldValueIs",
  schema: 
    a: 
      type: String
      allowedValues: ["foo", "bar"]
    b:
      type: String
