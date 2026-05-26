1.Architecture overview

3 layer architecture

1.routes - recives the request, calles the  service,return the response 
2.services - the business logic 
3.storage - read and write db.json  


2. folder structure 

src/ 
 routes/
   templates.js
 services/
   templeteService.js
 storage/
   storage.js
db.json
 tests/
  template.test.js
SPEC.md
README.md
DECISIONS.md
package.json 



3.Data model 

json
{
    "id" : "unique-id"
    "name" : "template name"
    "tags" ; "["tag1',"tag2"]"
    "variables" : "[
        {"name" : "language", "dafault" : "javascript"},
        {"name" : "context"}
    ],
    "currentVersion" : 1,
    "createdAt" : "2026-05-26T...."
    "versions" : [
        {
            "version" : 1
            "content": "review {{language}} code for {{context}}"
            "createdAt" : "...."
        }
    ]
}


4. API endpoints 

1. create template 

POST /templetes
body : {name, tags,content,variables}
success : 201 created template with version 1 
error :  400 - missing required fields 

2. List template 

GET /templates
query param : list all (with ?tag= and ?name= filters)
sucess : 200 - array of templates 
no match : 200 - empty array []

3. GET templates by ID

GET /templates/:id
success : 200 - template with latest version content
error - 404 "template not found"

4. Update template 

PATCH /templates/:id
body : {content,tags,variables}
success : 200 - update template with the new version number 
error: 404 : "template not found"

5. get specific version 

GET/templates/:id/versions/:version 
success : 200 - specific version content 
error : 404 : "version not found"
error 404 : "template not found"


6. render template

POST /templates/:id/render 
body: {variables:{language:"python", context : "performance"}}
success: 200 - {rendered : "final prompt text"} 
error : 400 - { error: "missing required vaiables : context"}
unknown vaiables - silently ignored 
missing variables with default - use default value



5. testable scenarios 

POST /templates
vailid request - 201, version 1 
missing name - 400

GET /templates 
no filter - all templates 
filter by tag - matching only 
no matches - empty array 

GET /templates/:id
valid id - latest version 
invalid id - 404 

PATCH /templates/:id
update - craete a new version 
invalid id - 404 

GET /templates/:id/versions/:version
vaild id and version - correct content 
varsion not found - 404 
id not found - 404 

POST /templates/:id/render 
all variables provied - rendered text 
missing variables has default - use default
unknow variables - ignored 
missing required varibales - 400 with missing list 


6. Decisions and assumptions 
1. used json files for persistence - simple , no setup is requied, PRD allows it 
2. only content/variable update create ner verison - name/tag changes are metadata 
3. latest version = higher version number 
4. no authentication as per the PRD scope 
5. rendering uses latest version by default 
