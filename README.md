==========================================================================================================================
1) bootstrap: 
==========================================================================================================================
Uputstvo za preuzimanje:
	1) otvoriti u VS-Code terminal (command prompt)
	2) pozicionirati se u frontend folder
	3) izvrsiti komandu: npm install bootstrap bootstrap-icons
	4) izvrsiti komandu: npm install @types/bootstrap
	5) u frontend/angular.json fajlu izmeniti:
		* "projects" -> "frontend" -> "architect" -> "build" -> "options" -> "styles" treba da izgleda ovako:
			"styles": [
				"node_modules/bootstrap/dist/css/bootstrap.min.css",
				"node_modules/bootstrap-icons/font/bootstrap-icons.css",
				"src/styles.css"
            ]
		* "projects" -> "frontend" -> "architect" -> "build" -> "options" -> "scripts" treba da izgleda ovako:
			"scripts": [
				"node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
            ]
==========================================================================================================================
2) ikonice za kartice 
==========================================================================================================================
Uputstvo za preuzimanje:
	1) otvoriti u VS-Code terminal (command prompt)
	2) pozicionirati se u frontend folder
	3) izvrsiti komandu: npm install @fortawesome/fontawesome-free
	4) u frontend/angular.json fajlu izmeniti:
			* "projects" -> "frontend" -> "architect" -> "build" -> "options" -> "styles" treba da izgleda ovako:
			"styles": [
				"node_modules/bootstrap/dist/css/bootstrap.min.css",
				"node_modules/bootstrap-icons/font/bootstrap-icons.css",
				=============================================================
				"node_modules/@fortawesome/fontawesome-free/css/all.min.css",
				=============================================================
				"src/styles.css"
            ]
==========================================================================================================================
3) ukljuci algoritam za enkripciju
==========================================================================================================================
	1) npm install @types/crypto-js
==========================================================================================================================
4) ukljuci multer da bi mogao da citas blobove iz formsData polja
==========================================================================================================================
	1) npm install @types/multer