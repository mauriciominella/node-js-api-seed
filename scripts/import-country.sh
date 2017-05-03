if [ $# -lt 1 ]; then
  echo Usage: `basename $0` uppercase_contry_code 1>&2
    exit 1
fi

COUNTRY_CODE=$1

wget http://download.geonames.org/export/dump/$COUNTRY_CODE.zip -P ./data
unzip ./data/$COUNTRY_CODE.zip -d ./data
node ./scripts/geonames.js ./data/$COUNTRY_CODE.txt

mv ./data/cities.json ./data/$COUNTRY_CODE.json

# mongoimport -d local -c cities ./data/$COUNTRY_CODE.json --jsonArray
rm ./data/$COUNTRY_CODE.txt
rm ./data/$COUNTRY_CODE.zip
rm ./data/readme.txt
