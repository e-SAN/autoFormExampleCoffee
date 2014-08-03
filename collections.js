//Schema
Documents = new Meteor.Collection("documents", {
  schema: {
    requiredString: {
      type: String
    },
    optionalString: {
      type: String,
      optional: true
    },
    labelString: {
      type: String,
      label: "This is a custom label",
      optional: true
    },
    longString: {
      type: String,
      optional: true,
      max: 1000
    },
    maxString: {
      type: String,
      optional: true,
      max: 10
    },
    minString: {
      type: String,
      optional: true,
      min: 10
    },
    optionalStringArray: {
      type: [String],
      optional: true,
      minCount: 2,
      maxCount: 4
    },
    requiredBoolean: {
      type: Boolean,
      defaultValue: true
    },
    optionalBoolean: {
      type: Boolean,
      optional: true
    },
    radioBoolean: {
      type: Boolean,
      optional: true,
      defaultValue: true
    },
    selectBoolean: {
      type: Boolean,
      optional: true,
      defaultValue: false
    },
    requiredSelect: {
      type: Number,
      allowedValues: [1, 2, 3],
      defaultValue: 2
    },
    optionalSelect: {
      type: String,
      allowedValues: ["one", "two", "three"],
      optional: true
    },
    firstOptionSelect: {
      type: Number,
      allowedValues: [1, 2, 3],
      optional: true
    },
    firstOptionRequiredSelect: {
      type: Number,
      custom: function() {
        if (this.isSet && (!this.operator || this.operator === "$set") && !_.contains([1, 2, 3], this.value)) {
          return "notAllowed";
        }
      },
      autoform: {
        options: [
          {label: "One", value: 1},
          {label: "Two", value: 2},
          {label: "Three", value: 3}
        ]
      }
    },
    maxSelect: {
      type: [Number],
      allowedValues: [1, 2, 3],
      optional: true,
      maxCount: 2
    },
    minSelect: {
      type: [Number],
      allowedValues: [1, 2, 3],
      optional: true,
      minCount: 2
    },
    requiredNumber: {
      type: Number
    },
    optionalNumber: {
      type: Number,
      optional: true
    },
    maxNumber: {
      type: Number,
      optional: true,
      max: 10
    },
    minNumber: {
      type: Number,
      optional: true,
      min: 10
    },
    decimal: {
      type: Number,
      optional: true,
      decimal: true
    },
    requiredDate: {
      type: Date
    },
    optionalDate: {
      type: Date,
      optional: true
    },
    minDate: {
      type: Date,
      optional: true,
      min: (new Date(Date.UTC(2013, 0, 1)))
    },
    maxDate: {
      type: Date,
      optional: true,
      max: (new Date(Date.UTC(2012, 11, 31)))
    },
    requiredEmail: {
      type: String,
      regEx: SimpleSchema.RegEx.Email
    },
    optionalEmail: {
      type: String,
      regEx: SimpleSchema.RegEx.Email,
      optional: true
    },
    requiredUrl: {
      type: String,
      regEx: SimpleSchema.RegEx.Url
    },
    optionalUrl: {
      type: String,
      regEx: SimpleSchema.RegEx.Url,
      optional: true
    },
    'a.b.c': {
      type: String,
      label: "Subdocument field value",
      optional: true
    },
    items: {
      type: Array,
      optional: true
    },
    'items.$': {
      type: Object,
      label: "Item"
    },
    'items.$.name': {
      type: String
    },
    'items.$.quantity': {
      type: Number
    }
  }
});

Documents.simpleSchema().messages({
  noD: "No Ds allowed!!!",
  'regEx requiredEmail': "[label] is not a valid e-mail address",
  'regEx optionalEmail': "[label] is not a valid e-mail address",
  'regEx requiredUrl': "[label] is not a valid URL",
  'regEx optionalUrl': "[label] is not a valid URL"
});

Persons = new Meteor.Collection("persons", {
  schema: {
    _id: {
      type: String,
      optional: true
    },
    firstName: {
      type: String,
      label: "First name",
      max: 30
    },
    lastName: {
      type: String,
      label: "Last name",
      max: 30,
      unique: true
    },
    createdAt: {
      type: Date,
      autoValue: function () {
        if (this.isInsert) {
          return new Date;
        } else {
          this.unset();
        }
      },
      denyUpdate: true
    }
  }
});

Persons.helpers({
  fullName: function () {
    return this.firstName + ' ' + this.lastName;
  }
});

Persons.simpleSchema().messages({
  notUnique: "Only one of each last name allowed"
});

var Schemas = {};

UI.registerHelper("Schemas", Schemas);

Schemas.ContactForm = new SimpleSchema({
  name: {
    type: String,
    label: "Your name",
    max: 50
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    label: "E-mail address"
  },
  message: {
    type: String,
    label: "Message",
    max: 1000
  }
});
Schemas.ContactForm.messages({
  'regEx email': "[label] is not a valid e-mail address"
});

Dates = new Meteor.Collection("dates", {
  schema: {
    date: {
      type: Date,
      optional: true
    },
    dateTime: {
      type: Date,
      optional: true
    },
    dateTimeLocal: {
      type: Date,
      optional: true
    }
  }
});

FieldValueIs = new Meteor.Collection("FieldValueIs", {
  schema: {
    a: {
      type: String,
      allowedValues: ["foo", "bar"]
    },
    b: {
      type: String
    }
  }
});