if [ ! -s src/data/input.csv ]
  then :
    echo "\nCreating input.csv in src/data/"
    touch src/data/input.csv && echo "ID,Wallet Address,Priv Key,Mnemonic,OKX Wallet,Binance Wallet,Pontem Wallet,Pontem Priv Key,Scam,Linea,Scroll,Zora,Galxe,Clasters" >> src/data/input.csv
fi

if [ ! -s src/data/to-update.csv ]
  then :
    echo "\nCreating to-update.csv in src/data/"
    touch src/data/to-update.csv && echo "ID,Wallet Address,Priv Key,Mnemonic,OKX Wallet,Binance Wallet,Pontem Wallet,Pontem Priv Key,Scam,Linea,Scroll,Zora,Galxe,Clasters" >> src/data/to-update.csv
fi

if [ ! -s src/data/duplicates.csv ]
  then :
    echo "\nCreating duplicates.csv in src/data/"
    touch src/data/duplicates.csv && echo "ID,Wallet Address,Priv Key,Mnemonic,OKX Wallet,Binance Wallet,Pontem Wallet,Pontem Priv Key,Scam,Linea,Scroll,Zora,Galxe,Clasters" >> src/data/duplicates.csv
fi

if [ ! -s src/data/found.csv ]
  then :
    echo "\nCreating found.csv in src/data/"
    touch src/data/found.csv && echo "" >> src/data/found.csv
fi
if [ ! -s src/data/not-found.csv ]
  then :
    echo "\nCreating not-found.csv in src/data/"
    touch src/data/not-found.csv && echo "" >> src/data/not-found.csv
fi

if [ ! -s src/data/search.csv ]
  then :
    echo "\nCreating search.csv in src/data/"
    touch src/data/search.csv && echo "value_to_search" >> src/data/search.csv
fi
