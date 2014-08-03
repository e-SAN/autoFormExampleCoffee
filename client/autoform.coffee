SimpleSchema.debug = true

Session.setDefault "showPersonForm", true

Meteor.subscribe "docs"
Meteor.subscribe "persons"
Meteor.subscribe "dates"

contactCB = 
  after: 
    sendEmail: ->
      console.log "after sendEmail hook"
  onSubmit: ->
    console.log "onSubmit hook"
    #//this.resetForm();
    #//return false;

AutoForm.hooks
  docForm: 
    before:
      insert: (doc)->
        console.log "before.insert received document", doc
        doc
    docToForm: (doc)->
      if _.isArray doc.optionalStringArray
        doc.optionalStringArray = doc.optionalStringArray.join ", "
      doc
    formToDoc: (doc)->
      if typeof doc.optionalStringArray is "string"
        doc.optionalStringArray = doc.optionalStringArray.split ","
      doc
  contactForm: contactCB
  contactForm2: contactCB
  contactForm3: contactCB
  personsForm: 
    before: 
      remove: (id)->
        name = Persons.findOne(id).fullName
        confirm "Remove #{name}?"

AutoForm.addHooks ['docForm', 'datesForm1', 'datesForm2', 'datesForm3', 'myQuickForm'], 
  after: 
    insert: (error, result)->
      if error 
        console.log "Insert Error:", error
      else 
        console.log "Insert Result:", result
    update: (error)->
      if error
        console.log "Update Error:", error
      else
        console.log "Updated!"
    remove: (error)->
      console.log "Remove Error:", error

AutoForm.addHooks null,
  onSubmit: ()->
    console.log "onSubmit ALL FORMS!", arguments

Documents.simpleSchema().validator (key, val, def)->
  if val is "d"
    return "noD"
  true

Template.example.helpers
  docsCollection: -> 
    Documents
  selectedDoc: ->
    Documents.findOne Session.get("selectedDoc")
  newDocMode: ->
    not Session.get("selectedDoc")
  tester: {}

Template.datesForm.helpers
  dateDoc: -> null
  #//return Dates.findOne({_id: "pR95N5sxMTsaXe8e8"});
  dateTimeDoc: -> null
  #//return Dates.findOne({_id: "TfFqjdJ6EYfjAdhE3"});
  dateTimeLocalDoc: -> null
  #//return Dates.findOne({_id: "pMcpm4vxkA5Hq4SyM"});
  today: -> dateToDateString new Date

bodyTestDataHelper = ->
  if Session.get "selectedDoc" 
    docFormType: "update"
  else
    docFormType: "insert"

UI.body.testData = bodyTestDataHelper

dateToDateString = (date)->
  m = date.getMonth() + 1
  if m < 10
    m = "0" + m
  d = date.getDate()
  if d < 10
    d = "0" + d
  
  date.getFullYear() + '-' + m + '-' + d

Template.docTable.documents = -> Documents.find()

Template.example.events
  'click .docSelect': (e, t)->
    e.preventDefault()
    AutoForm.resetForm "docForm"
    Session.set "selectedDoc", @_id

  'click .docClear': (e, t)->
    e.preventDefault()
    AutoForm.resetForm "docForm"
    Session.set "selectedDoc", null

Template.virtualFields.helpers
  persons: -> Persons.find().fetch()
  showPersonForm: -> Session.get "showPersonForm"

Template.reactiveCurrentValue.currentAFieldValue = ->
  AutoForm.getFieldValue("reactiveCurrentValueForm", "a") ? "not selected"

UI.registerHelper "numSelectOptions", (options)->
  [
    {label: "One", value: 1},
    {label: "Two", value: 2},
    {label: "Three", value: 3}
  ]

UI.registerHelper "log", (what, who)->
  console.log what, who


