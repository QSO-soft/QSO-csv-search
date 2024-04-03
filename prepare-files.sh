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

