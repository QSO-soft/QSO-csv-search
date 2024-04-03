import { Settings } from '../types';

export const SETTINGS: Settings = {
  // Столбец по которому будет производиться поиск
  // 'ID' |  'Wallet Address' | 'Priv Key' | 'Serial Number' | 'Mnemonic' | 'OKX Wallet'
  // 'Binance Wallet' | 'Pontem Wallet' | 'Pontem Priv Key' | 'Scam' | 'Ads Pass'
  fieldToSearch: 'ID',

  // Столбцы, которые будут выведены в found.csv, чтоб вывести все, необходимо оставить []
  fieldsToReceive: [],

  filters: {
    // Использовать ли вместо search.csv фильтра
    useFilter: true,

    // Фильтра по любым столбцам
    // Примеры:
    // 'Wallet Address': '0x1' - найдет те поля, где значение 0x1
    // Scam: true - найдет те поля, где значение true
    // Linea: null - найдет те поля, где значение пустое
    // Transactions: '>5' - найдет те поля, где значение 5 и более
  },
};
