export default interface from{
  id: string;
  name: string | null
}
export interface comment{
  id: string;
  created_time: string | null 
  from: from | null 
  fromOwner: string | null
  message: string | null
}


export default interface dataMessags{
  data: comment[]| null;
}