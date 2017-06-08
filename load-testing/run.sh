# starting application containers
docker-compose up -d prod

# waiting for api to respond
until $(curl --output /dev/null --silent --head --fail http://localhost:8080/_ping); do
  printf '.'
  sleep 5
done

# load initial data
docker-compose up data-loader

# running load tests
artillery run hello.yml

# stopping and removing application containers
docker rm -f $(docker ps --filter 'name=nodejsapiseed*' -qa)
