#### Adding new resources
	in '.\Dienstnutzer' dirrectory open the 'format.json' file and add a the new resource in json form like the following.
	Check if its a valid json. For example you can check this on "https://jsonlint.com/". Thats all :)
	
		"resource": {
			"name": "",
			"games": []
		}

#### LOGIN
	- the system doest have a login system (not yet), but we need an user that interacts with the api.
	- type 'login' and return it. Then the system asks you what user id you want to login with.
	- to see what user ids are available you can make a 'GET' on 'users'.

#### COMMANDS
	- 'exit' to close the program"
	- 'GET' / 'PUT' / 'DELETE' or 'POST' to specify what you want to do with a resource"
	- after the REST verb the system will ask you what resource you want to edit.
	  please note, when interacting with a spezific resource to enter the whole path 'resource/{id}' (example: 'groups/34SAeta5').

    - IN EDITMODE: (POST or PUT) editmode is to change values from an object.
	- 'name=test123' to set the changes for the object
	- 'close' to exit editmode and cancel the process
	- 'send' to send request

#### available Resources
	- groups
	- groups/{groupId}
	- users
	- users/{userId}
	- games 			(POST not available)
	- games/{gameId}	(PUT not available)

#### info
	for more information visit our Wiki
	https://github.com/plunata/WBA2SS18TorkEbelWreschino/wiki