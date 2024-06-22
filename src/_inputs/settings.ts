import { Settings } from '../types';

export const SETTINGS: Settings = {
  // Столбец по которому будет производиться поиск
  // ID, evm_address, evm_priv_key, evm_mnemonic, okx_evm, binance_evm, bitget_evm, bybit_evm, aptos_address
  // aptos_priv_key, okx_aptos, solana_address, solana_priv_key, is_scam, ads_serial_number, ads_pass,proxy
  fieldToSearch: 'evm_address',

  // Столбцы, которые будут выведены в found.csv, чтоб вывести все, необходимо оставить []
  // fieldsToReceive: ['ID', 'evm_address', 'evm_priv_key', 'bitget_evm', 'okx_evm'],
  fieldsToReceive: ['ID', 'solana_wallet', 'solana_privkey'],
  // fieldsToReceive: ['ID', 'ads_serial_number', 'ads_pass', 'evm_priv_key'],
  // fieldsToReceive: ['ID', 'ads_serial_number', 'ads_pass', 'evm_mnemonic'],

  filters: {
    // Использовать ли вместо search.csv фильтра
    useFilter: true,

    // Фильтра по любым столбцам
    // Примеры:
    // 'Wallet Address': '0x1' - найдет те поля, где значение 0x1
    // Scam: true - найдет те поля, где значение true
    // Linea: null - найдет те поля, где значение пустое
    // Transactions: '>5' - найдет те поля, где значение 5 и более
    // ads_serial_number: '!null', // - найдет не пустые поля,
    blabla: '!null',
    // zkSync: 'in=0x', // - найдет те поля, которые имеют указанное значение
  },

  // По какому столбцу выполнять сортировку
  // Можно оставить '', чтоб ее не выполнять
  sortBy: '',
  // Порядок сортировки
  // 'ASC' - от меньшего к большему
  // 'DESC' - от большего к меньшему
  sortOrder: 'ASC',
};
