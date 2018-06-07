#### Adding new resources
	in '.\Dienstnutzer' dirrectory open the 'format.json' file and add a the new resource in json form like this:
	
		"resource": {
			"id": "",
			"name": "",
			"games": []
		}

	thats all the program will do everything.

#### COMMANDS
	- 'exit' to close the program"
	- GET / PUT / DELETE or POST to interact with the resources"
	- after one of the REST verb: write one of the available resources

    - IN EDITMODE: 
	- name='test123' to set the changes for the object
	- 'close' to exit editmode and cancel the process
	- 'send' to send request

#### available Resources
	- groups
	- groups/{groupId}
	- games
	- games/{gamesId}