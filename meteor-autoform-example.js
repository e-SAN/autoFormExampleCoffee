//Schema
Documents = new Meteor.Collection2("documents", {
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
        requiredBoolean: {
            type: Boolean
        },
        optionalBoolean: {
            type: Boolean,
            optional: true
        },
        radioBoolean: {
            type: Boolean,
            optional: true
        },
        selectBoolean: {
            type: Boolean,
            optional: true
        },
        requiredSelect: {
            type: Number,
            allowedValues: [1, 2, 3]
        },
        optionalSelect: {
            type: String,
            allowedValues: ["One", "Two", "Three"],
            optional: true
        },
        firstOptionSelect: {
            type: Number,
            allowedValues: [1, 2, 3],
            optional: true
        },
        firstOptionRequiredSelect: {
            type: Number,
            valueIsAllowed: function(val) {
                return (val === 1 || val === 2 || val === 3);
            }
        },
        maxSelect: {
            type: [Number],
            allowedValues: [1, 2, 3],
            optional: true,
            max: 2
        },
        minSelect: {
            type: [Number],
            allowedValues: [1, 2, 3],
            optional: true,
            min: 2
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
            regEx: SchemaRegEx.Email,
            regExMessage: "is not a valid e-mail address"
        },
        optionalEmail: {
            type: String,
            regEx: SchemaRegEx.Email,
            regExMessage: "is not a valid e-mail address",
            optional: true
        },
        requiredUrl: {
            type: String,
            regEx: SchemaRegEx.Url,
            regExMessage: "is not a valid URL"
        },
        optionalUrl: {
            type: String,
            regEx: SchemaRegEx.Url,
            regExMessage: "is not a valid URL",
            optional: true
        },
        'a.b.c': {
            type: String,
            label: "Subdocument field value",
            optional: true
        }
    }
});

Documents.allow({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    },
    fetch: []
});

Persons = new Meteor.Collection2("persons", {
    schema: {
        firstName: {
            type: String,
            label: "First name",
            max: 30
        },
        lastName: {
            type: String,
            label: "Last name",
            max: 30
        }
    },
    virtualFields: {
        fullName: function(person) {
            return person.firstName + " " + person.lastName;
        }
    }
});

Persons.allow({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    },
    fetch: []
});

ContactForm = new AutoForm({
    name: {
        type: String,
        label: "Your name",
        max: 50
    },
    email: {
        type: String,
        regEx: SchemaRegEx.Email,
        regExMessage: "is not a valid e-mail address",
        label: "E-mail address"
    },
    message: {
        type: String,
        label: "Message",
        max: 1000
    }
});

if (Meteor.isClient) {
    Meteor.subscribe("docs");
    Meteor.subscribe("persons");

    Documents.callbacks({
        insert: function(error, result) {
            if (error) {
                console.log("Insert Error:", error);
            } else {
                alert("Inserted!");
                console.log("Insert Result:", result);
            }
        },
        update: function(error) {
            if (error) {
                console.log("Update Error:", error);
            } else {
                alert("Updated!");
            }
        },
        remove: function(error) {
            console.log("Remove Error:", error);
        }
    });
    
    Persons.beforeRemove = function (id) {
        var name = Persons.findOne(id).fullName;
        return confirm("Remove " + name + "?");
    };
    
    ContactForm.callbacks({
        "sendEmail": function () {
            console.log(_.toArray(arguments));
        }
    });

    Template.example.selectedDoc = function() {
        return Documents.findOne(Session.get("selectedDoc"));
    };

    Template.docTable.documents = function() {
        return Documents.find();
    };

    Template.buttons.newDocMode = function() {
        return !Session.get("selectedDoc");
    };

    Template.example.events({
        'click .docSelect': function(e, t) {
            e.preventDefault();
            Documents.simpleSchema().resetValidation();
            Session.set("selectedDoc", this._id);
        },
        'click .docClear': function(e, t) {
            e.preventDefault();
            Documents.simpleSchema().resetValidation();
            Session.set("selectedDoc", null);
        }
    });

    Template.buttons.events({
        'click button[type=reset]': function(e, t) {
            Documents.simpleSchema().resetValidation();
        }
    });

    Template.virtualFields.persons = function() {
        return Persons.find();
    };

    Handlebars.registerHelper("numSelectOptions", function() {
        return [
            {label: "One", value: 1},
            {label: "Two", value: 2},
            {label: "Three", value: 3}
        ];
    });

    Handlebars.registerHelper("strSelectOptions", function() {
        return [
            {label: "One", value: "One"},
            {label: "Two", value: "Two"},
            {label: "Three", value: "Three"}
        ];
    });
}

if (Meteor.isServer) {
    Meteor.publish("docs", function() {
        return Documents.find();
    });
    Meteor.publish("persons", function() {
        return Persons.find();
    });

    Meteor.methods({
        sendEmail: function(doc) {
            var text = "Name: " + doc.name + "\n\n"
                    + "Email: " + doc.email + "\n\n\n\n"
                    + doc.message;

            console.log("Sent E-mail:\n\n" + text);
            return true;
        }
    });

    Meteor.startup(function() {
        //Documents.remove({});
    });
}