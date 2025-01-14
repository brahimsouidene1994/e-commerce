import { COLORS } from "services/constants";
import Utils from "services/utils/utilities";

// export default interface from{
//   id: string;
//   name: string | null
// }
export interface comment{
  id: number;
  idComment: string;
  created_time: string | null 
  // from: from | null 
  from: string | null
  message: string | null
  idPost: string | null
  status: string | null
}


export default interface dataComments{
  data: comment[]| null;
}



export interface Column {
  id: 'message' | 'created_time' | 'from' | 'status';
  label?: string;
  width?: string;
  format?: (value: boolean) => string;
  format_date?: (value: string) => string
  isStatus?: (value: string) => boolean;
}

export const columns: readonly Column[] = [
  { id: 'message', label: 'Phone Number (Comment)', width: '60%', },
  { id: 'from', label: 'By', width: '20%' },
  { id: 'created_time', label: 'Created ', width: '20%', format_date: (value: string) => Utils.formatDate(value).toString() },
  { id: 'status', label: 'Status ', width: '30%', isStatus: (value: string) => value in COLORS ? true : false }
];