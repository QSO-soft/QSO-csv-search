import { Settings } from '../types';

export const SETTINGS: Settings = {
  // Столбец по которому будет производиться поиск
  // 'ID' |  'Wallet Address' | 'Priv Key' | 'Serial Number' | 'Mnemonic' | 'OKX Wallet'
  // 'Binance Wallet' | 'Pontem Wallet' | 'Pontem Priv Key' | 'Scam' | 'Ads Pass'
  fieldToSearch: 'Wallet Address',

  // Столбцы, которые будут выведены в found.csv, чтоб вывести все, необходимо оставить []
  // fieldsToReceive: ['ID','Wallet Address'],
  fieldsToReceive: [],

  filters: {
    // Использовать ли вместо search.csv фильтра
    useFilter: false,

    // Фильтра по любым столбцам
    // Примеры:
    // 'Wallet Address': '0x1' - найдет те поля, где значение 0x1
    // Scam: true - найдет те поля, где значение true
    // Linea: null - найдет те поля, где значение пустое
    // Transactions: '>5' - найдет те поля, где значение 5 и более
    // walletAddress: '!null' - найдет не пустые поля,
    // walletAddress: 'in=0x' - найдет те поля, которые имеют указанное значение
    // walletAddress: '!in=0x' - найдет те поля, которые не имеют указанного значения
  },

  // По какому столбцу выполнять сортировку
  // Можно оставить '', чтоб ее не выполнять
  sortBy: '',
  // Порядок сортировки
  // 'ASC' - от меньшего к большему
  // 'DESC' - от большего к меньшему
  sortOrder: 'ASC',
};
