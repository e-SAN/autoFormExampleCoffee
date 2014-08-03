_.each [Documents, Persons, Dates, FieldValueIs, FieldValueContains], 
  (collection)->
    collection.allow
      insert: ->  true
      update: ->  true
      remove: ->  true
      fetch: []

Meteor.publish "docs", -> Documents.find()

Meteor.publish "persons", -> Persons.find()

Meteor.publish "dates", -> Dates.find()

Meteor.methods
  sendEmail: (doc)->
    check doc, Schemas.ContactForm
    text = """
              Name:  #{doc.name}  


              Email:  #{doc.email} 



              #{doc.message}
              """

    console.log """Sent E-mail:
                    

                    #{text}
                    """
    sleep(4000); #//simulate real delay
    true
  
Meteor.startup ->
    #//Documents.remove({});

sleep = (ms)->
  done = Date.now() + ms
  while Date.now() < done