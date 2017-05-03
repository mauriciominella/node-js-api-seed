if [ $# -lt 1 ]; then
  echo Usage: `basename $0` uppercase_contry_code 1>&2
    exit 1
fi

COUNTRY_CODE=$1

mongoimport -d local -c cities ./$COUNTRY_CODE.json --jsonArray
