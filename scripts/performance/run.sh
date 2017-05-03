docker-compose up prod

artillery quick --duration 60 --rate 10 -n 20 "http://localhost:8080/population/compute?cityName=Mumbai&radiusInKm=30"
