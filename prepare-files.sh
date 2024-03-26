if [ ! -s src/data/input.csv ]
  then :
    echo "\nCreating input.csv in src/data/"
    touch src/data/input.csv && echo "ID,Wallet Address,Priv Key,Mnemonic,OKX Wallet,Binance Wallet,Pontem Wallet,Pontem Priv Key,Scam,Linea,Scroll,Zora" >> src/data/input.csv
fi

if [ ! -s src/data/to-update.csv ]
  then :
    echo "\nCreating to-update.csv in src/data/"
    touch src/data/to-update.csv && echo "ID,Wallet Address,Priv Key,Mnemonic,OKX Wallet,Binance Wallet,Pontem Wallet,Pontem Priv Key,Scam,Linea,Scroll,Zora" >> src/data/to-update.csv
fi

if [ ! -s src/data/output.csv ]
  then :
    echo "\nCreating output.csv in src/data/"
    touch src/data/output.csv && echo "" >> src/data/output.csv
fi

if [ ! -s src/data/search.csv ]
  then :
    echo "\nCreating search.csv in src/data/"
    touch src/data/search.csv && echo "field_to_search,value_to_search" >> src/data/search.csv
fi
