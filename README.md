# TextKernel fullstack assignment

## Starting the application and importing initial data to Mongo
* Navigate to application directory and start the application using the following command,
```
   docker-compose up prod
```

* Connect to the mongo db container
```
   docker exec -it textkernelmauricioassignment_mongo_1 bash
```

* Navigate to "appdata" folder and execute the following command:
```
  ./import-initial-data.sh
```

* In order to execute geopatial queries, with a good performance we need to create an index for our coordinates field:
```
   mongo < create-index.js
```

### Limitations of this approach:
Depends on docker and do not give us the freedom to perform this operation passing other database address. But as it is just a prototype, I tried to keep as simple as possible to the person who will run that, avoiding mongo and node manual instalation by using docker.

## Adding support for more countries
The information used for this application can be found on http://download.geonames.org/export/dump/.

Instead of doing the process of adding a new country manually, by download the zip file, converting to mongo format and importing to mongo, you can follow the following steps:

Prerequisites:
* Having node JS 6x or 7x installed on your machine
* Having unzip installed
* Having wget installed

* Navigate to application folder and execute, where COUNTRY_CODE is an valid ISO country code
```
  npm run download-country [COUNTRY_CODE]
```

* Connect to the mongo db container
```
   docker exec -it textkernelmauricioassignment_mongo_1 bash
```

* Navigate to "appdata" folder and execute the following command, where [COUNTRY_CODE] represents the country you want to import:
```
  ./import-country.sh [COUNTRY_CODE]
```

### Limitations
* This is a quite manual process that wouldn't go well in production. If I have more time I would the following to provide a better support for new countries:
* We have considerable big TSV files. Importing them using the Web Service it is not the best approach as it could take long and overload the server and generate timeouts.
* A more user friendly approach would be implement a worker and a queue along with a importing route that would upload the file and feed the queue, processing it separately
* Also an extra route to check the if the importing process status would be needed

## Approach to solve the problem
* A new route has been created in the api to deal with this
* This route will get a city name and the radius as input
* We need to query the database and find the search city latitude, longitude and population
* We need to the query the database again and find all cities that are near to the search city latitude and longitude within the radius
* At this point we will have a list of cities and its population. All we have to do is sum the population of all these cities

## Limitations
This approach is not accurate if the user would like to select and area in map, for example. We would need to find another solution or check if there are other kinds of databases available with another granularity for the population info.

## Using the application
### Compute population
The web service provides a route to perform the population computing.

```
   Method: GET
   /population/compute
```
This route take 2 query string parameters: cityName and the radiusInKm.

Here is an example of use with curl:

```
  curl "http://localhost:8080/population/compute?cityName=Mumbai&radiusInKm=30"
```

The request will return the following response:
```
  {
    "cityName": "Mumbai",
    "radiusInKm": "30",
    "population": 30826604,
    "numberOfCities": 29
  }
```
### Response
* cityName: it is the searched city, passed in the request
* radiusInKm: it is the radius passed in the request
* population: sum of the population that are within this radius based on the searched city coordinates
* numberOfCities: the number of cities that are within the radius

### Limitations
I'm not 100% sure it passing the parameters via query string is the best option for this case, I would need to think more about it if worth passing if as JSON in the body using a POST method. As this route is querying the API, and it is not modifying data any data, it seems to be a good approach.

## Add a new country
```
http://localhost:8080/countries/addAsync/ZW
```


## General technical limitations and possible improvements
### Code quality
* I used a layered architecture. This way it is possible to test layers separately and have a better code organization, helping separating concerns.
* Creating integration tests. I've created a draft for the integration tests that is not working. But it would take some extra time to create the infra-structure for inserting data for this tests
* Creating unit tests and split some parts: I could have written unit tests for the sumPopulation function, for example, and move it to a separated file exporting as a public function to be tested. As it was a quite simple function, I haven't prioritize due to the time limitation.


### Scalability
* I'm happy with the api layer, apart from the importing feature that is far com scalable, but I've already proposed a solution for that previously
* Using docker and node we would place the api easily behind a load balancer and having as many instances are needed to handle the desirable number of request
* Regarding to the MongoDb scalability, I'm not so sure on how to scale the database layer due to my lack of knowledge on mongo. But we can use some strategies depending on the use and load of the api like caching some frequent requests
