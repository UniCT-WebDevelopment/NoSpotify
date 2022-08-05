info:
	@echo "make option are:"
	@echo " - run-frontend		"
	@echo " - run-backend	"
	@echo " - run-db	"
	@echo " - build-frontend	"



init-backend:
	cd noSpotify-Backend && npm i && npm run start && cd ..

init-frontend:
	cd noSpotify-Frontend  && npm i --force && ng serve && cd ..

clear-backend:
	cd noSpotify-Backend && rm -R node_modules && npm i && npm run start && cd ..

clear-frontend:
	cd noSpotify-Frontend && rm -R node_modules && npm i --force && ng serve && cd ..

build-frontend:
	cd noSpotify-Frontend && ng  build --aot --prod --output-hashing none && cd ..

run-frontend:
	cd noSpotify-Frontend && ng serve && cd ..

run-backend:
	cd noSpotify-Backend && npm run start && cd ..

run-db:
	docker-compose up -d

	
