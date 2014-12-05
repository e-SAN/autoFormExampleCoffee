#//Schema

@FieldValueContains = new Meteor.Collection "FieldValueContains", 
  schema: 
    a: 
      type: [String]
      allowedValues: ["foo", "bar"]
    b: 
      type: String
    
