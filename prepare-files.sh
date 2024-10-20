# INPUTS =================================================================
if [ ! -s src/_inputs/csv/input.csv ]
  then :
    echo "\nCreating input.csv in src/_inputs/csv/"
    touch src/_inputs/csv/input.csv && echo "ID,Wallet Address,Priv Key,Mnemonic,OKX Wallet,Binance Wallet,Pontem Wallet,Pontem Priv Key,Scam,Linea,Scroll,Zora,Galxe,Clasters" >> src/_inputs/csv/input.csv
fi

if [ ! -s src/_inputs/csv/to-update.csv ]
  then :
    echo "\nCreating to-update.csv in src/_inputs/csv/"
    touch src/_inputs/csv/to-update.csv && echo "ID,Wallet Address,Priv Key,Mnemonic,OKX Wallet,Binance Wallet,Pontem Wallet,Pontem Priv Key,Scam,Linea,Scroll,Zora,Galxe,Clasters" >> src/_inputs/csv/to-update.csv
fi

if [ ! -s src/_inputs/csv/search.csv ]
  then :
    echo "\nCreating search.csv in src/_inputs/csv/"
    touch src/_inputs/csv/search.csv && echo "value_to_search" >> src/_inputs/csv/search.csv
fi

if [ ! -s src/_inputs/csv/proxies.csv ]
  then :
    echo "\nCreating proxies.csv in src/_inputs/csv/"
    touch src/_inputs/csv/proxies.csv && echo "proxy" >> src/_inputs/csv/proxies.csv
fi

# OUTPUTS =================================================================

if [ ! -d src/_outputs ]
  then :
    mkdir src/_outputs
fi

if [ ! -d src/_outputs/csv ]
  then :
    mkdir src/_outputs/csv
fi

if [ ! -s src/_outputs/csv/found.csv ]
  then :
    echo "\nCreating found.csv in src/_outputs/csv/"
    touch src/_outputs/csv/found.csv && echo "" >> src/_outputs/csv/found.csv
fi
if [ ! -s src/_outputs/csv/not-found.csv ]
  then :
    echo "\nCreating not-found.csv in src/_outputs/csv/"
    touch src/_outputs/csv/not-found.csv && echo "field_to_search,value_to_search" >> src/_outputs/csv/not-found.csv
fi
if [ ! -s src/_outputs/csv/duplicates.csv ]
  then :
    echo "\nCreating duplicates.csv in src/_outputs/csv/"
    touch src/_outputs/csv/duplicates.csv && echo "duplicated_value" >> src/_outputs/csv/duplicates.csv
fi

if [ ! -s src/_outputs/csv/proxies-success.csv ]
  then :
    echo "\nCreating proxies-success.csv in src/_outputs/csv/"
    touch src/_outputs/csv/proxies-success.csv && echo "proxy" >> src/_outputs/csv/proxies-success.csv
fi
if [ ! -s src/_outputs/csv/proxies-fail.csv ]
  then :
    echo "\nCreating proxies-fail.csv in src/_outputs/csv/"
    touch src/_outputs/csv/proxies-fail.csv && echo "proxy" >> src/_outputs/csv/proxies-fail.csv
fi

# ENCRYPTION =================================================================
if [ ! -d src/_inputs/txt ]
  then :
    mkdir src/_inputs/txt
fi
if [ ! -d src/_outputs/txt ]
  then :
    mkdir src/_outputs/txt
fi
if [ ! -s src/_inputs/txt/encrypted.txt ]
  then :
    echo "\nCreating encrypted.txt in src/_inputs/txt/"
    touch src/_inputs/txt/encrypted.txt
fi
if [ ! -s src/_inputs/txt/decrypted.txt ]
  then :
    echo "\nCreating decrypted.txt in src/_inputs/txt/"
    touch src/_inputs/txt/decrypted.txt
fi
